# 既定値は、Setting.default_language または LanguageContext.value どちらが良いのでしょうね？

module M17nResource
  class << self
    def get(resouce, lang = Setting.default_language)
      resouce[lang] || 'no resource'
    end

    def set!(resouce, value, lang = Setting.default_language)
      resouce.merge!({ lang.to_s => value })
    end

    def default_resource
      @default_resource ||= Setting.available_languages.index_with { |_| '' }
    end

    using JsonExt

    def to_resource(source, opts = {})
      resource = JSON.try_parse(source, opts)
      default_resource.merge(
        if resource.is_a?(Hash)
          resource
        else
          { Setting.default_language => source.to_s }
        end
      )
    end

    def to_json(object, opts = nil)
      resource = if object.is_a?(Hash)
                   object.transform_keys(&:to_s)
                 elsif object.is_a?(String)
                   { Setting.default_language => object }
                 else
                   {}
                 end
      JSON.generate(default_resource.merge(resource), opts)
    end
  end
end
