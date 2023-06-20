# ラベル
class CreateLabels < ActiveRecord::Migration[7.0]
  def change
    create_table :labels do |t|
      t.string :keyword, limit: 50, null: false # ラベルキー
      t.text :label, null: false, default: '' # ラベル（JSONハッシュ）
      t.text :short_label, null: false, default: '' # 省略ラベル（JSONハッシュ）
      t.index :keyword, unique: true
    end
  end
end
