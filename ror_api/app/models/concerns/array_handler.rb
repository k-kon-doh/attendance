# JSON配列ハンドラ
module ArrayHandler
  extend ActiveSupport::Concern

  included do
    after_initialize :init_arrayed_attributes
  end

  module ClassMethods
    def arrayed(name)
      "arrayed_#{name}"
    end

    def array_attributes
      @array_attributes
    end

    def array_attribute(*names)
      @array_attributes = names

      names.each { |name| attribute arrayed(name).to_sym, :string }

      ActiveSupport::CodeGenerator.batch(Module.new.tap { |mod| include mod }, __FILE__, __LINE__) do |put_in_module|
        names.each do |name|
          arrayed_name = arrayed(name)

          # rubocop:disable Style/LineEndConcatenation
          put_in_module.define_cached_method(arrayed_name, namespace: :array_attribute) do |sources|
            sources <<
              "def #{arrayed_name}" <<
              "@#{arrayed_name} ||= (json_try_parse(self[:#{name}]) || [])" <<
              'end'
          end

          put_in_module.define_cached_method("#{arrayed_name}=", namespace: :array_attribute) do |sources|
            sources <<
              "def #{arrayed_name}=(value)" <<
              "@#{arrayed_name} = normalize(value)" <<
              "self[:#{arrayed_name}] = @#{arrayed_name}" <<
              "self[:#{name}] = json_generate(@#{arrayed_name})" <<
              'end'
          end
          # rubocop:enable Style/LineEndConcatenation
        end
      end
    end
  end

  def normalize(object)
    if object.nil?
      []
    elsif object.is_a?(Array)
      object
    else
      [object]
    end
  end

  def arrayed(name)
    self.class.arrayed(name)
  end

  def array_attributes
    self.class.array_attributes
  end

  def init_arrayed_attributes
    array_attributes&.each { |name| self[arrayed(name).to_sym] = send(arrayed(name)) }
  end

  using JsonExt

  def json_try_parse(value)
    JSON.try_parse(value)
  end

  def json_generate(value)
    JSON.generate(value)
  end
end
