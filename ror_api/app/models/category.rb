# カテゴリー
class Category < ApplicationRecord
  include Localization

  localize_attribute :name, :short_name

  def self.whole
    cache.a
  end

  def self.members(keyword)
    cache.h[keyword]&.a
  end

  def self.member(keyword, code)
    cache.h[keyword]&.h&.[](code)
  end

  CatetgorySet = Struct.new('CategorySet', :h, :a)
  private_constant :CatetgorySet

  MemberSet = Struct.new('MemberSet', :h, :a)
  private_constant :MemberSet

  def self.cache
    Rails.cache.fetch('Category', expires_in: 1.hour) do
      categories = CatetgorySet.new({}.with_indifferent_access, [])
      current_keyword = 'miss match at first time'
      members = nil
      all.order(keyword: :asc, show_order: :asc, code: :asc).each do |it|
        if current_keyword != it.keyword
          members = MemberSet.new({}.with_indifferent_access, [])
          categories.h[it.keyword] = members
          current_keyword = it.keyword
        end
        members.h[it.code] = it
        members.a.push(it)
        categories.a.push(it)
      end
      categories
    end
  end
  private_class_method :cache
end
