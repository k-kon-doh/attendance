# TODO: テーブル構成の再検討
# 今回は、安直にナイーブツリーにしましたが綺麗になりませんね。

# 組織
class Organization < ApplicationRecord
  include Localization

  belongs_to :parent, class_name: 'Organization', foreign_key: :upper_organization_id, inverse_of: :children, optional: true
  has_many :children, class_name: 'Organization', foreign_key: :upper_organization_id, inverse_of: :parent, dependent: nil
  has_many :employees, dependent: nil

  attribute :path, :string
  localize_attribute :name

  # 自組織全体を取得（root組織(upper_organization_id IS NULL)の兄弟は含めない）
  def self.family(id)
    node = cache.nodes[id]
    node.nil? ? [] : depth_first_search(node.root)
  end

  # 下位組織を取得（指定IDの組織を含む）
  # (descendantsは、ActiveSupport同名メソッドと衝突します。)
  def self.progenies(id)
    node = cache.nodes[id]
    node.nil? ? [] : depth_first_search(node)
  end

  # 上位組織を取得（指定IDの組織を含む）
  def self.ancestors(id)
    ancestors = []
    node = cache.nodes[id]
    while node
      ancestors << node.organization
      node = node.parent
    end
    ancestors.reverse
  end

  Node = Struct.new('OrganizationNode', :root, :parent, :children, :organization)
  private_constant :Node

  OrganizationSet = Struct.new('OrganizationSet', :ids, :nodes)
  private_constant :OrganizationSet

  def self.cache
    Rails.cache.fetch('Organization', expires_in: 1.hour) do
      data = OrganizationSet.new({}, {})
      all.order(Arel.sql('CASE WHEN upper_organization_id IS NULL THEN -1 else upper_organization_id END, show_order, code')).each do |it|
        data.ids[it.id] = it
        node = Node.new(nil, nil, [], it)
        data.nodes[it.id] = node
        node.parent = data.nodes[it.upper_organization_id]
        node.root = node.parent&.root || node
        node.parent&.children&.<< node
      end
      data
    end
  end
  private_class_method :cache

  def self.depth_first_search(node)
    progenies = []
    nodes = [node]
    while nodes.present?
      node = nodes.pop
      progenies << node.organization
      nodes.push(*node.children.reverse) if node.children.present?
    end
    progenies
  end
  private_class_method :depth_first_search

  def self.do_not_use_family(id)
    ancestors_start_sql = Organization.where(id:).to_sql
    ancestors_recursive_sql = Organization.select('PARENT.*').from('ancestors CHILD').joins("INNER JOIN #{table_name} PARENT ON PARENT.id=CHILD.upper_organization_id").to_sql
    ancestors_sql = "WITH ancestors AS (#{ancestors_start_sql} UNION ALL #{ancestors_recursive_sql})"

    start_path = %[PRINTF('%03d', hierarchy) || PRINTF('%03d', show_order) path]
    recursive_path = %[PARENT.path || PRINTF('%03d', CHILD.hierarchy) || PRINTF('%03d', CHILD.show_order) path]

    descendants_start_sql = Organization.select("*, #{start_path}").from("ancestors #{table_name}").where(upper_organization_id: nil).to_sql
    descendants_recursive_sql = Organization.select("CHILD.*, #{recursive_path}").from('descendants PARENT').joins("INNER JOIN #{table_name} CHILD ON CHILD.upper_organization_id=PARENT.id").to_sql
    descendants_sql = ", descendants AS (#{descendants_start_sql} UNION ALL #{descendants_recursive_sql})"

    Organization.select('*').from("(#{ancestors_sql}#{descendants_sql} SELECT * FROM descendants) #{table_name}").order(:path)
  end

  def self.do_not_use_ancestors(id)
    start_sql = Organization.where(id:).to_sql
    recursive_sql = Organization.select('PARENT.*').from('ancestors CHILD').joins("INNER JOIN #{table_name} PARENT ON PARENT.id=CHILD.upper_organization_id").to_sql
    Organization.select('*').from("(WITH ancestors AS (#{start_sql} UNION ALL #{recursive_sql}) SELECT * FROM ancestors) #{table_name}").order(:hierarchy)
  end

  def self.do_not_use_descendants(id)
    start_path = %[PRINTF('%03d', hierarchy) || PRINTF('%03d', show_order) path]
    start_sql = Organization.select("*, #{start_path}").where(id:).to_sql

    recursive_path = %[PARENT.path || PRINTF('%03d', CHILD.hierarchy) || PRINTF('%03d', CHILD.show_order) path]
    recursive_sql = Organization.select("CHILD.*, #{recursive_path}").from('descendants PARENT').joins("INNER JOIN #{table_name} CHILD ON CHILD.upper_organization_id=PARENT.id").to_sql
    Organization.select('*').from("(WITH descendants AS (#{start_sql} UNION ALL #{recursive_sql}) SELECT * FROM descendants) #{table_name}").order(:path)
  end
end
