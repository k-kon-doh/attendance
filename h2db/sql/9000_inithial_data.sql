
-- 初期値
set @schema public.getenv('SCHEMA');
set schema @schema;

-- 設定
insert into settings values
    ('max_of_login_failes', '5', 'ログイン失敗最大回数')
  , ('default_language', 'ja', '既定言語')
  , ('available_languages', '["ja", "en"]', 'サポート言語')
;

-- カレンダー(休日)
insert into holidays values
    (-1, date'2023-04-01')
  , (-1, date'2023-04-02')
  , (-1, date'2023-04-08')
  , (-1, date'2023-04-09')
  , (-1, date'2023-04-15')
  , (-1, date'2023-04-16')
  , (-1, date'2023-04-22')
  , (-1, date'2023-04-23')
  , (-1, date'2023-04-29')
  , (-1, date'2023-04-30')
;

-- カテゴリー
insert into categories values
    ('validity', '0', '{"ja":"無効", "en":"invalid"}', '{"ja":"無効", "en":"invalid"}', 2)
  , ('validity', '1', '{"ja":"有効", "en":"valid"}', '{"ja":"有効", "en":"valid"}', 1)

  , ('required ', '0', '{"ja":"任意", "en":"optional"}', '{"ja":"任意", "en":"opt."}', 1)
  , ('required ', '1', '{"ja":"必須", "en":"required"}', '{"ja":"必須", "en":"req."}', 1)

  , ('necessary ', '0', '{"ja":"不要", "en":"not needed"}', '{"ja":"不要", "en":"not"}', 2)
  , ('necessary ', '1', '{"ja":"必須", "en":"required"}', '{"ja":"必須", "en":"req."}', 1)
  , ('necessary ', '2', '{"ja":"任意", "en":"optional"}', '{"ja":"任意", "en":"opt."}', 1)

  , ('shift', '1', '{"ja":"日勤", "en":"day shift"}', '{"ja":"日勤", "en":"day"}', 1)
  , ('shift', '2', '{"ja":"夜勤", "en":"night shift"}', '{"ja":"夜勤", "en":"night"}', 2)
  , ('shift', '3', '{"ja":"２交代", "en":"two-shifts"}', '{"ja":"２交", "en":"two"}', 3)
  , ('shift', '4', '{"ja":"３交代", "en":"three-shifts"}', '{"ja":"３交", "en":"three"}', 4)

  , ('feature', '1', '{"ja":"勤怠申請", "en":"Self. Apply"}', '{"ja":"申請", "en":"Apply"}', 1)
  , ('feature', '2', '{"ja":"代理勤怠申請", "en":" Rep. Apply"}', '{"ja":"代理", "en":" Rep."}', 2)
  , ('feature', '3', '{"ja":"勤怠申請承認", "en":"Appl. Approve"}', '{"ja":"承認", "en":"Appr."}', 3)
  , ('feature', '4', '{"ja":"マスタ保守", "en":"Master Maint."}', '{"ja":"マ保", "en":"Maint."}', 4)

  , ('attendance_family', '1', '{"ja":"単独", "en":"solo"}', '{"ja":"単独", "en":"solo"}', 1)
  , ('attendance_family', '2', '{"ja":"計画と実績", "en":"plan and result"}', '{"ja":"計実", "en":"plan&rslt"}', 2)

  , ('attendance_subfamily', '1', '{"ja":"単独", "en":"solo"}', '{"ja":"単独", "en":"solo"}', 1)
  , ('attendance_subfamily', '2', '{"ja":"計画", "en":"plan"}', '{"ja":"計画", "en":"plan"}', 2)
  , ('attendance_subfamily', '3', '{"ja":"実績", "en":"result"}', '{"ja":"実績", "en":"result"}', 3)

  , ('attendance_status', '1', '{"ja":"作成中", "en":"making"}', '{"ja":"作中", "en":"making"}', 1)
  , ('attendance_status', '2', '{"ja":"申請中", "en":"applying"}', '{"ja":"申中", "en":"applying"}', 2)
  , ('attendance_status', '3', '{"ja":"承認", "en":"approved"}', '{"ja":"承認", "en":"approved"}', 3)
  , ('attendance_status', '4', '{"ja":"却下", "en":"rejected"}', '{"ja":"却下", "en":"rejected"}', 4)

  , ('attendance_execution', '0', '{"ja":"未実施", "en":"not yet"}', '{"ja":"未実", "en":"not yet"}', 1)
  , ('attendance_execution', '1', '{"ja":"実施", "en":"done"}', '{"ja":"実施", "en":"done"}', 2)
;

-- ラベル
insert into labels values
    ('title' , '{"ja":"勤怠管理", "en":"attendance"}', '{"ja":"勤怠", "en":"appl."}')

  , ('login' , '{"ja":"ログイン", "en":"login"}', '{"ja":"login", "en":"login"}')
  , ('logout' , '{"ja":"ログアウト", "en":"logout"}', '{"ja":"logout", "en":"logout"}')
  , ('login_id' , '{"ja":"ログインID", "en":"login ID"}', '{"ja":"login ID", "en":"id"}')
  , ('password' , '{"ja":"パスワード", "en":"password"}', '{"ja":"password", "en":"pwd"}')

  , ('attendance_kind' , '{"ja":"勤怠内容", "en":"kind"}', '{"ja":"内容", "en":"kind"}')
  , ('status' , '{"ja":"状態", "en":"status"}', '{"ja":"状態", "en":"status"}')
  , ('subfamily' , '{"ja":"申請種類", "en":"subfamily"}', '{"ja":"種類", "en":"subfamily"}')
  , ('execution' , '{"ja":"実施状態", "en":"execution"}', '{"ja":"実施", "en":"exec"}')
  , ('begin_date' , '{"ja":"開始日付", "en":"begin date"}', '{"ja":"自日", "en":"begin d."}')
  , ('begin_time' , '{"ja":"開始時刻", "en":"begin time"}', '{"ja":"至時", "en":"begin t."}')
  , ('end_date' , '{"ja":"終了日付", "en":"end date"}', '{"ja":"至日", "en":"end d."}')
  , ('end_time' , '{"ja":"終了時刻", "en":"end time"}', '{"ja":"至時", "en":"end t."}')
  , ('shift' , '{"ja":"勤務形態", "en":"shift"}', '{"ja":"勤務", "en":"shift"}')
  , ('reason' , '{"ja":"備考/理由", "en":"notes/reason"}', '{"ja":"備考", "en":"notes"}')
  , ('application_date' , '{"ja":"申請日", "en":"application date"}', '{"ja":"申請日", "en":"appl. d."}')
  , ('agent' , '{"ja":"代理申請者", "en":"agent"}', '{"ja":"代理", "en":"agent"}')
  , ('approver' , '{"ja":"承認者", "en":"approver"}', '{"ja":"承認者", "en":"approver"}')
  , ('approval_date' , '{"ja":"承認日", "en":"approval date"}', '{"ja":"承認日", "en":"appr. d."}')
  , ('approval_comment' , '{"ja":"承認コメント", "en":"approval comment"}', '{"ja":"コメント", "en":"comment"}')
  , ('employee' , '{"ja":"社員", "en":"employee"}', '{"ja":"社員", "en":"employee"}')
  , ('validity' , '{"ja":"有効/無効", "en":"validity"}', '{"ja":"有/無効", "en":"validity"}')
  , ('required' , '{"ja":"必須", "en":"required"}', '{"ja":"必須", "en":"required"}')

  , ('person' , '{"ja":"人", "en":"person"}', '{"ja":"人", "en":"person"}')
  , ('people' , '{"ja":"人", "en":"people"}', '{"ja":"人", "en":"people"}')
  , ('n_of_employees' , '{"ja":"社員数", "en":"number of employee"}', '{"ja":"数", "en":"n."}')
  , ('date' , '{"ja":"日付", "en":"date"}', '{"ja":"日付", "en":"date"}')
  , ('time' , '{"ja":"時間", "en":"time"}', '{"ja":"時間", "en":"time"}')

  , ('new' , '{"ja":"申請作成", "en":"new"}', '{"ja":"新規", "en":"new"}')
  , ('show' , '{"ja":"申請確認", "en":"show"}', '{"ja":"確認", "en":"show"}')
  , ('edit' , '{"ja":"申請編集", "en":"edit"}', '{"ja":"編集", "en":"edit"}')
  , ('approve' , '{"ja":"申請承認", "en":"approve"}', '{"ja":"承認", "en":"approve"}')

  , ('search' , '{"ja":"検索", "en":"search"}', '{"ja":"検索", "en":"search"}')
  , ('apply' , '{"ja":"申請", "en":"apply"}', '{"ja":"申請", "en":"apply"}')
  , ('accept' , '{"ja":"承認", "en":"accept"}', '{"ja":"承認", "en":"accept"}')
  , ('reject' , '{"ja":"却下", "en":"reject"}', '{"ja":"却下", "en":"reject"}')
  , ('save' , '{"ja":"保存", "en":"save"}', '{"ja":"保存", "en":"save"}')
  , ('back' , '{"ja":"戻る", "en":"back"}', '{"ja":"戻る", "en":"back"}')
  , ('clear' , '{"ja":"クリア", "en":"clear"}', '{"ja":"クリア", "en":"clear"}')

  , ('feature' , '{"ja":"機能", "en":"feature"}', '{"ja":"機能", "en":"feature"}')
  , ('criteria' , '{"ja":"検索条件", "en":"criteria"}', '{"ja":"条件", "en":"criteria"}')

  , ('self_agent' , '{"ja":"申請方法", "en":"method"}', '{"ja":"方法", "en":"method"}')
  , ('self_apply' , '{"ja":"自己申請", "en":"self"}', '{"ja":"自己", "en":"self"}')
  , ('agent_apply' , '{"ja":"代理申請", "en":"agent"}', '{"ja":"代理", "en":"agent"}')

;

-- メッセージ
insert into messages values
    ('pls_input_login_id' , '{"ja":"ログインIDを入力してください", "en":"Please input login id."}')
  , ('pls_input_password' , '{"ja":"パスワードを入力してください", "en":"Please input password."}')
  , ('fail_login' , '{"ja":"ログインに失敗しました。", "en":"failed to login."}')
  , ('invalid_usr_pwd' , '{"ja":"ログインIDまたはパスワードが違います。", "en":"can''t login."}')
  , ('not_login' , '{"ja":"ログインしていません。", "en":"not login."}')
  , ('locked_out' , '{"ja":"ロックアウトされています。", "en":"locked out."}')
  , ('logged_out' , '{"ja":"ログアウトしました。", "en":"logged out"}')

  , ('pls_input' , '{"ja":"入力してください", "en":"Please input."}')
  , ('invalid_id' , '{"ja":"IDが正しくありません。", "en":"invalid attendance id."}')
  , ('invalid_value' , '{"ja":"値が正しくありません。", "en":"invalid value."}')

  , ('reversed_date' , '{"ja":"日付が同じ、または、逆です。", "en":"[begin date] and [end date] are equal or reversed."}')
  , ('reversed_time' , '{"ja":"時間が同じ、または、逆です。", "en":"[begin time] and [end time] are equal or reversed."}')


  , ('pls_check_entry' , '{"ja":"入力内容を確認して下さい。", "en":"Please check your entry."}')

  , ('fail_approver_fetch' , '{"ja":"承認者の取得に失敗しました。", "en":"failed to fetch approver."}')

  , ('no_attendance' , '{"ja":"勤怠情報がありません。", "en":"No attendance information."}')
  , ('fail_attendance_new' , '{"ja":"勤怠情報の作成に失敗しました。", "en":"failed to create attendance information."}')
  , ('fail_attendance_fetch' , '{"ja":"勤怠情報の取得に失敗しました。", "en":"failed to fetch attendance information."}')
  , ('fail_attendance_register' , '{"ja":"勤怠情報の登録に失敗しました。", "en":"failed to register attendance information."}')
  , ('fail_optimistic_lock' , '{"ja":"既に情報が更新されています。。", "en":"fail optimistic lock."}')

  , ('success_attendance_new' , '{"ja":"作成しました。", "en":"succeeded in creation."}')
  , ('success_attendance_register' , '{"ja":"登録しました。", "en":"succeeded in registration."}')
  , ('success_attendance_apply' , '{"ja":"申請しました。", "en":"succeeded in application."}')
  , ('success_attendance_accept' , '{"ja":"承認しました。", "en":"succeeded in approval."}')
  , ('success_attendance_reject' , '{"ja":"却下しました。", "en":"succeeded in rejection."}')

;

-- 役割
insert into roles values
    (1, '{"ja":"作業者", "en":"worker"}',   1)
  , (2, '{"ja":"リーダー", "en":"leader"}', 2)
  , (3, '{"ja":"管理者", "en":"manager"}',  3)
;
alter table roles alter column id set generated by default restart with 4;

-- 役割・機能
insert into role_features values
    (1, 1, '1')
  , (2, 2, '1')
  , (3, 2, '2')
  , (4, 3, '1')
  , (5, 3, '2')
  , (6, 3, '3')
  , (7, 3, '4')
;
alter table roles alter column id set generated by default restart with 8;

-- 組織
insert into organizations values
    ( 1, '1000', '{"ja":"A事業部", "en":"Dept.A"}',   null, 0, 1, 1)

  , ( 2, '1100', '{"ja":"第１製造部", "en":"Div.1"}',    1, 1, 1, 1)
  , ( 3, '1110', '{"ja":"製造１課", "en":"Sect.1"}',     2, 2, 1, 1)
  , ( 4, '1111', '{"ja":"１班", "en":"Group1"}',         3, 3, 1, 1)
  , ( 5, '1112', '{"ja":"２班", "en":"Group2"}',         3, 3, 2, 1)

  , ( 6, '1120', '{"ja":"設備課", "en":"sect.2"}',       2, 2, 2, 1)
  , ( 7, '1121', '{"ja":"１班", "en":"1"}',              6, 3, 1, 1)
  , ( 8, '1122', '{"ja":"２班", "en":"2"}',              6, 3, 2, 1)

  , ( 9, '2000', '{"ja":"B事業部", "en":"DeptB"}',    null, 0, 2, 1)
  , (10, '2100', '{"ja":"生産部", "en":"Div.1"}',        9, 1, 1, 1)
  , (11, '2110', '{"ja":"部品課", "en":"Sect.1"}',      10, 2, 1, 1)
  , (12, '2111', '{"ja":"表面処理", "en":"surface"}',   11, 3, 1, 1)
 ;
alter table organizations alter column id set generated by default restart with 13;

-- 社員 （password_digest と choice_id は、login_id のダイジェスト）
insert into employees(id, no, name, login_id, password_digest, choice_id, role_id, organization_id) values
    ( 1, 'user1000a', '{"ja":"ユーザ1000a", "en":"name1000a"}', 'u1000a','$2a$12$xNTtSg89Tm0dbDwF3AyJw.kTOIy8uc4OGztiLLU/saOP9Dd9NxIWS','$2a$12$tS3nKpP1N.fd3N46JwDh9.hoWN6s6hYll8pp7gu4ByTyWKSW4l0UO', 3, 1)
  , ( 2, 'user1100a', '{"ja":"ユーザ1100a", "en":"name1100a"}', 'u1100a','$2a$12$.nUBbqA.WkGQSscDG9uMMemxKHag5MgjvbfIoI5S40dMhstIv0t/W','$2a$12$y86yz0r.RHtDsWhfKcx2z.DoDP.x1OQXDWb46jK3.bs1JI730nz1e', 3, 2)
  , ( 3, 'user1110a', '{"ja":"ユーザ1110a", "en":"name1110a"}', 'u1110a','$2a$12$ZIOR4SkNeZmSaekA5K.0qu7gq6RaIY94RXmMWLyxE4gCNgq8qPVzS','$2a$12$./KwzB3cQZeaMVo25RUCGuDnmyDE9Jj7uwy6Az5tE8D23sSs6xVtm', 3, 3)
  , ( 4, 'user1110b', '{"ja":"ユーザ1110b", "en":"name1110b"}', 'u1110b','$2a$12$gS4owNNYcEDiHil6uSU.GeqIxJG7bOJQWbBEaRPcaO/I947m8Bdlq','$2a$12$4LP7owXlvvmZePoTT7YWv.EWOgANFeBs29pO/AUqpq5LUG/p8fXBm', 2, 3)
  , ( 5, 'user1110c', '{"ja":"ユーザ1110c", "en":"name1110c"}', 'u1110c','$2a$12$hcnHI5aFefy35OrW20NJ4OIKiaABEwnJoIS9w7dZvQu4wjEDPKtm2','$2a$12$CdBpgeakq4xEYG6hqYPEIO36T9qmEGqtzlZFVEuWuEjRKRG1HR3zK', 3, 3)
  , ( 6, 'user1111a', '{"ja":"ユーザ1111a", "en":"name1111a"}', 'u1111a','$2a$12$2tq6TR.u3rCwXPrtDL2tnuyeZ3rt6i9hxx1LwvYtDwXjo8azjFekK','$2a$12$dRz557CK6QU.dSMoE7WmPeWHTY3nnOoS2.ZWZMan.0bLXkZgxNqFC', 1, 4)
  , ( 7, 'user1111b', '{"ja":"ユーザ1111b", "en":"name1111b"}', 'u1111b','$2a$12$fEGDSk6nq2zGc7wapPFjFuzerYtoJ470RedVGcSJSu0uM7Nhg196C','$2a$12$5xBQ4UUk30NXACKaDnJIkuCtIg78cquGWhvQnTpEWmnNoEDO3ahN.', 1, 4)
  , ( 8, 'user1111c', '{"ja":"ユーザ1111c", "en":"name1111c"}', 'u1111c','$2a$12$zPhtgbcW3xDhz/BuTegAQesxuNR9iUV7sMyn.OZZQUZyAFpFiJq0m','$2a$12$/5FqMqfb0nA0WlOQH16ql.Kz/OiA09moRCyXnz0gQlLpkyqXQkfGq', 1, 4)
  , ( 9, 'user1112a', '{"ja":"ユーザ1112a", "en":"name1112a"}', 'u1112a','$2a$12$dsjgB5DqWyym0x/aGEHsbuhqh6tTzXdtVtlaxSiSthydFzcbkMj.6','$2a$12$WGc7vZHq6z.k0s1WrDG3JOvc03L5nMvGIVJBIBMteVLwHFW6nKeQm', 1, 5)
  , (10, 'user1112b', '{"ja":"ユーザ1112b", "en":"name1112b"}', 'u1112b','$2a$12$Ug3ld3/KKQKdgOO6eNaECefOzaTM.bYuVUj4T93Cx7.dDpLf6buh6','$2a$12$yAcqWBZHzoNcdAnAq6Nav.5PomLDVpxu6INBOzPC8rzo9XRPRVZJq', 1, 5)
  , (11, 'user1112c', '{"ja":"ユーザ1112c", "en":"name1112c"}', 'u1112c','$2a$12$R7LMIfbS0AXU055HWcMMkex87taNCZ0q.g/BjWWXpY2lFmqMcRiOC','$2a$12$sfQDxCCrlRHA8QkLJzvqMeSJLIpGCbr4AtOLcDi9Z.4HO5ox0QE6W', 1, 5)
  , (12, 'user1112d', '{"ja":"ユーザ1112d", "en":"name1112d"}', 'u1112d','$2a$12$dMF708AP.1vMrXfxQI9wCuhOWTB6W9B/vrrjqEDy7u.PW5GcUp8zq','$2a$12$XeSHq8f9EnaEVAFoGlfw1O4029Z3Kt0i8YlUueO/j0sPoEW5kUWgm', 1, 5)
  , (13, 'user1120a', '{"ja":"ユーザ1120a", "en":"name1120a"}', 'u1120a','$2a$12$bygUSavn6FV81YnjhFSpCeGdBWybAjqpFnz3myiiOg/0TBnUsngwy','$2a$12$.Yd6x0AXjjxUwtVJj7pWvulJg.0PaOv.vCXzQ5JzrkRbPgkEP6bmq', 2, 6)
  , (14, 'user1120b', '{"ja":"ユーザ1120b", "en":"name1120b"}', 'u1120b','$2a$12$TT8goodWTocB8zcF7yUtSOWi0uMLTT7R.rcI8KICVB42PV.p5oeza','$2a$12$CwprimjUYSS1F.0krHaDteZphDzMr0GT/WjMwZOV.0WtfPvbphef2', 2, 6)
  , (15, 'user1121a', '{"ja":"ユーザ1121a", "en":"name1121a"}', 'u1121a','$2a$12$j.eQlLeJhQHdZDayyD0FAupOFH0L68h/iHWsKRtadLZfBSplLRc2u','$2a$12$6c2MyzPbT9DS9UtmxSl2XuTP0Hzvb.p1uqjQJ4VRZk/RH..biJ8Me', 1, 7)
  , (16, 'user1121b', '{"ja":"ユーザ1121b", "en":"name1121b"}', 'u1121b','$2a$12$nY7C2m25XgaTtNTrfDfCpe1OBd3pfgNomNzaoOdkePuLcAWzUBV4O','$2a$12$sil9ZzqN7BvnYFE75aWGVeH17i.XqgrtFojBMzsPnWkXPTjlSs6FO', 1, 7)
  , (17, 'user1121c', '{"ja":"ユーザ1121c", "en":"name1121c"}', 'u1121c','$2a$12$1zCjAMOTX1gdUplORqiWjOcoWfu4FQR1FH6WRGxaGoOqf6DSFnbY.','$2a$12$96QGKZudKYdGCuLyTkQJPefjYeYfoaYRKmqe3w.ambTGHCBv67Fpa', 1, 7)
  , (18, 'user1122a', '{"ja":"ユーザ1122a", "en":"name1122a"}', 'u1122a','$2a$12$WTRP4effzDuU.n5CUMRHmuPkjXhS8nAPH09ArTbWXNPMBFDXNGfTa','$2a$12$.BS53gzUL9fjlDr51iKY6uRENkmSrzzYn0NmTNiRnKuSox1bxbkRS', 1, 8)
  , (19, 'user1122b', '{"ja":"ユーザ1122b", "en":"name1122b"}', 'u1122b','$2a$12$6dI/J0gcSr77Gqwe1XR7Ze.DnxlP6KwE4lJ1Cm2SVd1S8ARvOQg5i','$2a$12$Mob49gnhwDkfBEsEDISJrut4V3TlPZfGFC/pdfFV/30WP.bNmF0Eu', 1, 8)
  , (20, 'user1122c', '{"ja":"ユーザ1122c", "en":"name1122c"}', 'u1122c','$2a$12$Lv5tURFSG3o51KFUscx4A.Ox6lrghg0t6NCEbVrX8bW9HFzqJoC9i','$2a$12$jgexQiu/NnMsja2ZQ33b7OuiTWSBLB3fBmmOz1LbpKBTVQH4PXfKe', 1, 8)
  , (21, 'user2000a', '{"ja":"ユーザ2000a", "en":"name2000a"}', 'u2000a','$2a$12$TLxi5UPPuEwwNJEy/5.3eO0BeRaOXN25KHQL6l9hG1eTDOw6mppxC','$2a$12$wq9NWMYP401PW1mbhM3Vr.2g72MKKc2vrS0yPXms83d.dSul2gJHC', 3, 9)
  , (22, 'user2100a', '{"ja":"ユーザ2100a", "en":"name2100a"}', 'u2100a','$2a$12$39oJRl5Jhv5lHa9EzCXoiuGTJOQW2xrmmlIGiL3pP7YzK2HekpHcK','$2a$12$R35Kth/cJ9yNtctyclkcR.MurOkqpCLgkcS5bL4o249fGnxKh/S0G', 3, 10)
  , (23, 'user2110a', '{"ja":"ユーザ2110a", "en":"name2110a"}', 'u2110a','$2a$12$6GUXVua8fG5YZRJG4d1ZBuO5mPOFqZExT7esEMGKjh91EjMEJJ4vi','$2a$12$fR9moPbxP192YvfPyT24q.t0e91dZw9cv94fOm8zq6NJ04XV8s//u', 2, 11)
  , (24, 'user2111a', '{"ja":"ユーザ2111a", "en":"name2111a"}', 'u2111a','$2a$12$Oknmb9oPeUc4kmLdNQ0xQ.YfGCKZwuyjNGwkjDcEdjto954EUTxbe','$2a$12$G2b3q0ph8rFcSCOAXrarSuw8/LY9cIVu7rx9Lyc3jKv1CrymKTnPm', 2, 12)
; 
alter table employees alter column id set generated by default restart with 25;

-- 社員セット

-- 社員セットメンバー

-- 申請タイプ
insert into attendance_kinds values
    (1, '{"ja":"遅刻", "en":"late"}', '{"ja":"遅刻", "en":"late"}',                       1, 1, 1, 0, 0,  true,  true, 1, 1)
  , (2, '{"ja":"早退", "en":"early "}', '{"ja":"早退", "en":"early "}',                   1, 1, 1, 0, 0,  true,  true, 2, 1)
  , (3, '{"ja":"外出", "en":"out"}', '{"ja":"外出", "en":"out"}',                         1, 1, 1, 0, 1,  true,  true, 3, 1)
  , (4, '{"ja":"早出残業", "en":"overtime(early)"}', '{"ja":"早残", "en":"ot(e)"}',       2, 1, 1, 0, 1,  true,  true, 4, 1)
  , (5, '{"ja":"残業", "en":"overtime"}', '{"ja":"残業", "en":"ot"}',                     2, 1, 1, 0, 1,  true,  true, 5, 1)
  , (6, '{"ja":"休日出勤", "en":"work on a day off"}', '{"ja":"休出", "en":"wk on do"}',  2, 1, 2, 0, 2,  true,  true, 6, 1)
  , (7, '{"ja":"振替出勤", "en":"substitute work"}', '{"ja":"振出", "en":"sub. wk"}',     2, 1, 2, 0, 2,  true,  true, 7, 1)
  , (8, '{"ja":"有休", "en":"paid holiday "}', '{"ja":"有休", "en":"paid do"}',           2, 1, 0, 2, 0,  true, false, 8, 1)
  , (9, '{"ja":"代休", "en":"compensatory day off"}', '{"ja":"代休", "en":"comp. do"}',   2, 1, 0, 2, 0,  true,  true, 9, 1)
  , (10, '{"ja":"振替休日", "en":"day off in lieu"}', '{"ja":"振休", "en":"do in lieu"}', 2, 1, 0, 2, 0,  true,  true, 10, 1)
  , (11, '{"ja":"欠勤", "en":"absence"}', '{"ja":"欠勤", "en":"absence"}',                1, 1, 0, 2, 0,  true,  true, 11, 1)
  , (12, '{"ja":"特別休日", "en":"special day off"}', '{"ja":"特休", "en":"special do"}', 2, 1, 0, 2, 0, false, false, 12, 1)
 ;
alter table attendance_kinds alter column id set generated by default restart with 13;

-- 勤怠
insert into attendances values
    ( 1, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 2,  '1', '3', '1', '1', CURRENT_DATE-10, '10:30', null,      '', '1', '遅刻：事故渋滞', CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '',               null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 3,  '2', '3', '1', '1', CURRENT_DATE-09, '16:00', null,      '', '1', '早退：体調不良', CURRENT_DATE-08, null, 2, CURRENT_DATE-08, '',               null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 4,  '3', '3', '1', '1', CURRENT_DATE-08, '13:00', null, '14:00', '1', '外出：葬儀',     CURRENT_DATE-08,    3, 2, CURRENT_DATE-08, '',               null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 5,  '4', '1', '1', '0', CURRENT_DATE-07, '06:00', null, '08:00', '1', '早出残業',       CURRENT_DATE-10,    3, 2,            null, '',               null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 6,  '5', '2', '1', '0', CURRENT_DATE-07, '18:00', null, '21:00', '1', '残業',           CURRENT_DATE-10,    3, 2,            null, '',               null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 7, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 8, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , ( 9, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , (10, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , (11, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , (12, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , (13, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , (14, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , (15, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
  , (16, '11', '3', '1', '1', CURRENT_DATE-11,      '', null,      '', '1', '欠勤',           CURRENT_DATE-10, null, 2, CURRENT_DATE-09, '事前申請せよ。', null, '1', 0, TIMESTAMP'2023-01-01 00:00:01', TIMESTAMP'2023-01-01 10:00:01')
 ;
alter table attendances alter column id set generated by default restart with 17;

-- 勤怠メンバー(勤怠ID, 社員ID)
insert into attendance_members values
    ( 1, 6)
  , ( 2, 6)
  , ( 3, 6)
  , ( 4, 6)
  , ( 5, 6)
  , ( 5, 7)
  , ( 6, 6)
  , ( 6, 7)
  , ( 6, 8)
  , ( 7, 6)
  , ( 8, 6)
  , ( 9, 6)
  , (10, 6)
  , (11, 6)
  , (12, 6)
  , (13, 6)
  , (14, 6)
  , (15, 6)
  , (16, 6)

