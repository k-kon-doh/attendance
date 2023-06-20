# 社員
class CreateEmployees < ActiveRecord::Migration[7.0]
  def change
    create_table :employees do |t|
      t.string :no, limit: 10, null: false # 社員番号
      t.text :name, null: false, default: '' # 氏名（JSONハッシュ）
      t.text :login_id, limit: 10, null: false # ログイン用ID
      t.text :password_digest, limit: 1024, null: false # ログイン用パスワード
      t.text :choice_id, limit: 1024, null: false # 選択肢で使用するID
      t.integer :role_id, null: false # 役割ID
      t.integer :organization_id, null: false # 所属組織ID
      t.timestamp :last_login_at, null: true # 最終ログイン日時
      t.integer :n_of_login_failes, null: false, default: 0 # ログイン失敗回数
      t.string :validity, limit: 50, null: false, default: '1' # categories:validity (0:無効 / 1:有効)
      t.index :no
      t.index :login_id
      t.index :choice_id, unique: true
      t.index :organization_id
    end
  end
end
