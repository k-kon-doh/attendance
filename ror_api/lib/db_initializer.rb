# データベース初期化機
module DbInitializer
  class << self
    def init
      # DBテーブルをクリア
      pattern = Regexp.compile('\d{14}_create_(\w+)[.]rb$', Regexp::IGNORECASE)
      tables = Rails.root.glob('db/migrate/*.rb').filter_map do |file_name|
        pattern.match(file_name.to_s)&.to_a&.at(1)
      end.uniq
      SqliteSequence.where(name: tables).delete_all
      tables.each { |it| it.downcase.singularize.classify.constantize.delete_all }

      # 勤怠と勤怠メンバーテーブルは、データをロードしない
      load_tables = tables.filter_map do |table_name|
        table_name unless %w[attendances attendance_members].include? table_name.downcase
      end

      # DBテーブルに初期データをロード
      pathnames = load_tables.map do |table|
        Rails.root.join('db', 'csv', "#{table}.csv")
      end
      csv_files = pathnames.filter_map do |pathname|
        pathname.exist? ? pathname : nil
      end
      csv_files.each do |csv_file|
        table = File.basename(csv_file, '.csv').downcase.singularize.classify.constantize
        CSV.open(csv_file, headers: :first_row, return_headers: false, col_sep: "\t", quote_char: "'") do |csv|
          csv.header_convert do |field|
            field.downcase.to_sym
          end
          csv.each { |row| table.create!(row.to_hash) }
        end
      end

      # 勤怠と勤怠メンバーテーブルのデータ生成
      date_hash = {
        "T": near_back_work_day,
        "P3": offset_near_work_day(3),
        "P6": offset_near_work_day(6),
        "P7": offset_near_work_day(7),
        "PS": near_fore_sunday,
        "PNS": next_fore_sunday,
        "N1": offset_near_work_day(-1),
        "N2": offset_near_work_day(-2),
        "N3": offset_near_work_day(-3),
        "BT": offset_near_work_day(-22),
        "BP1": offset_near_work_day(-22 + 1),
        "BP2": offset_near_work_day(-22 + 2),
        "BP3": offset_near_work_day(-22 + 3),
        "BP4": offset_near_work_day(-22 + 4),
        "BP5": offset_near_work_day(-22 + 5),
        "BP6": offset_near_work_day(-22 + 6),
        "BP7": offset_near_work_day(-22 + 7),
        "BP8": offset_near_work_day(-22 + 8),
        "BP9": offset_near_work_day(-22 + 9),
        "BPS": near_fore_sunday(offset_near_work_day(-22)),
        "BPS1": offset_near_work_day(1, near_fore_sunday(offset_near_work_day(-22))),
        "BPS2": offset_near_work_day(2, near_fore_sunday(offset_near_work_day(-22))),
        "BPNS": next_fore_sunday(offset_near_work_day(-22)),
        "BPNS1": offset_near_work_day(1, next_fore_sunday(offset_near_work_day(-22))),
        "BPNS2": offset_near_work_day(2, next_fore_sunday(offset_near_work_day(-22))),
        "BN1": offset_near_work_day(-22 + -1),
        "BN2": offset_near_work_day(-22 + -2),
        "BN3": offset_near_work_day(-22 + -3)
      }.with_indifferent_access

      Rails.root.glob('db/attendances/*.yml').each do |file_name|
        File.open(file_name) do |file|
          YAML.safe_load(file).each do |attributes|
            attributes['begin_date'] = date_hash[attributes['begin_date']]
            attributes['end_date'] = date_hash[attributes['end_date']]
            attributes['application_date'] = date_hash[attributes['application_date']]
            attributes['approval_date'] = date_hash[attributes['approval_date']]
            Attendance.create!(attributes)
          end
        end
      end
    end

    def near_fore_work_day(date = Date.today)
      return date + 2 if date.saturday?
      return date + 1 if date.sunday?

      date
    end

    def near_back_work_day(date = Date.today)
      return date - 1 if date.saturday?
      return date - 2 if date.sunday?

      date
    end

    def offset_near_fore_work_day(offset, date = Date.today)
      return date unless offset.positive?

      offset_date = near_fore_work_day(date)
      offset.times do
        offset_date += 1
        offset_date = near_fore_work_day(offset_date)
      end
      offset_date
    end

    def offset_near_back_work_day(offset, date = Date.today)
      return date unless offset.negative?

      offset_date = near_back_work_day(date)
      offset.abs.times do
        offset_date -= 1
        offset_date = near_back_work_day(offset_date)
      end
      offset_date
    end

    def offset_near_work_day(offset, date = Date.today)
      if offset.positive?
        offset_near_fore_work_day(offset, date)
      else
        offset_near_back_work_day(offset, date)
      end
    end

    def near_fore_sunday(date = Date.today)
      offset = 7 - date.wday
      offset = 0 if offset == 7
      date + offset
    end

    def next_fore_sunday(date = Date.today)
      near_fore_sunday(date) + 7
    end
  end
end
