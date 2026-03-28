Viết hoàn chỉnh cốt truyện World 1 cho Visual Novel RPG "No World To Return".

===== BỐI CẢNH GAME =====
Nhân vật chính: Lữ Khách — mất trí nhớ, không rõ danh tính, 
bị cuốn qua các thế giới đang hấp hối.
Tone: u tối + cynical. Mọi kết cục đều có giá phải trả.
Ngôn ngữ: Tên nhân vật/địa danh có thể tiếng Anh hoặc tiếng Việt.
Toàn bộ dialogue và mô tả: tiếng Việt, UTF-8, không escape unicode.

===== THẾ GIỚI 1 — "NGÀY THỨ BẢY VĨNH CỬU" =====
Id: dark_fantasy
Tone: Ambiguous — không có đúng sai tuyệt đối, mọi lựa chọn đều có cái giá.
Độ dài: 70+ scenes, nhiều nhánh.
Yếu tố cốt lõi: Mystery — sự thật hé lộ từng lớp, chậm rãi.

Concept thế giới:
Một vương quốc trung cổ bị kẹt trong vòng lặp 7 ngày suốt 300 năm.
Chỉ Lữ Khách nhận ra vòng lặp. Người dân sống bình thường nhưng 
mang nỗi bất an mơ hồ không thể gọi tên. Một số mơ về những 
cuộc đời họ chưa từng sống.
Vòng lặp được duy trì có chủ đích — và ai đó vẫn đang làm điều đó.

===== CẤU TRÚC LỚP BÍ ẨN (5 lớp) =====
Sự thật hé lộ dần. Mỗi lớp chỉ mở khi có đủ flag:

LỚP 1 (Hồi 1, luôn hiển thị):
"Thế giới này lặp lại mỗi 7 ngày. Có gì đó không ổn."

LỚP 2 (cần flag: da_noi_chuyen_3_npc_ve_giac_mo):
"Vòng lặp kéo dài lâu hơn bất kỳ ai thừa nhận.
Một số người có ký ức mờ nhạt từ các vòng trước."

LỚP 3 (cần flag: tim_thay_kho_luu_tru_hoang_cung):
"300 năm trước có một nghi lễ được thực hiện.
Lịch sử chính thống nói để ngăn dịch bệnh.
Nhưng không có hồ sơ dịch bệnh nào trước khi vòng lặp bắt đầu."

LỚP 4 (cần flag: gap_nu_hoang + affection_linh >= 80 HOẶC tin_tuong_vael):
"Dịch bệnh có thật. Nhưng nghi lễ không được thực hiện để ngăn nó —
mà được thực hiện SAU KHI mọi người đã chết rồi.
Vòng lặp không ngăn cái chết. Nó che giấu nó.
Mọi người trong thế giới này đã chết từ 300 năm trước."

LỚP 5 (cần flag: tim_thay_manh_ky_uc_01):
"Năng lượng của nghi lễ... quen thuộc một cách kỳ lạ.
Nó khớp với mảnh ký ức mờ nhạt mà Lữ Khách đang cố nhớ lại.
Kẻ đã hủy diệt quê hương của Lữ Khách...
đã sử dụng phép thuật giống hệt phép thuật tạo ra vòng lặp này."

===== NHÂN VẬT (stats cố định, không random) =====

LINH (Đồng hành):
Tuổi: 19 (theo cô — thực ra đã sống 300 năm trong vòng lặp)
Vai trò: bán hoa, NPC đầu tiên gặp, trở thành đồng hành chính
Tính cách: ấm áp bề ngoài, tuyệt vọng âm thầm bên trong
Cô đếm mọi thứ một cách ám ảnh — bước chân, lời nói, nhịp tim.
Cô không biết tại sao.
Icon: 🌸, màu: #f9a8d4
Bí mật (hé lộ khi affection >= 80):
  Cô nhớ mọi vòng lặp. Đã nhớ suốt 50 năm qua.
  Cô ngừng kể với người khác vì họ luôn quên.
  Cô đã chờ ai đó sẽ không quên.
  Có một cuốn nhật ký giấu dưới sàn nhà — 300 năm ghi chép.
Ngưỡng affection:
  30: chia sẻ những giấc mơ lặp đi lặp lại
  50: tiết lộ thói quen đếm bí mật
  65: thừa nhận cảm giác "đã làm điều này trước đây"
  80: tiết lộ cô nhớ tất cả
  95: mở khóa kết cục "Lựa Chọn Của Linh"

VAEL (Người dẫn đường/Mơ hồ):
Tuổi: trông 70, tuổi thật không rõ
Vai trò: nhà sử học thị trấn, biết nhiều hơn những gì nói
Tính cách: bí ẩn, hài hước khô khan, không bao giờ nói dối 
nhưng không bao giờ nói toàn bộ sự thật
Icon: 🕯️, màu: #94a3b8
Cửa hàng bán những cuốn sách không nên tồn tại —
lịch sử của những sự kiện chưa xảy ra.
Bí mật: Ông là người thực hiện nghi lễ ban đầu.
Không phải để cứu ai. Ông tạo vòng lặp để nghiên cứu cái chết —
ông muốn hiểu điều gì xảy ra sau khi chết.
Ông đã xem 300 năm những người giống nhau chết đi trong vòng lặp
và ghi lại từng biến thể.
Ông không còn cảm thấy gì về điều đó nữa.
Điều đó khiến ông sợ hơn bất cứ điều gì.
Hé lộ khi: flag "tim_thay_nghien_cuu_vael" + Lữ Khách đối chất trực tiếp.

NỮ HOÀNG SERAPHINE (Người Bảo Vệ Thế Giới — boss cố định):
Tuổi: 300+ (trông 35)
Vai trò: người cai trị, xuất hiện ở Hồi 2, trung tâm của phần giải quyết
Tính cách: quý phái, kiệt sức, kỳ lạ tốt bụng
Bà biết vòng lặp tồn tại. Bà chọn duy trì nó.
Vì vào Ngày 7 của dòng thời gian thật —
toàn bộ đội quân của bà chết trong một trận chiến do bà ra lệnh.
Vòng lặp là hình phạt tự nguyện của bà.
Bà sống lại cái chết của họ mỗi chu kỳ.
Bà sẽ không dừng lại cho đến khi tìm ra cách cứu họ hồi tố.
Điều đó là không thể. Bà biết điều này.
Icon: 👑, màu: #e2c97e
Stats cố định: không thể đánh bại trong chiến đấu bình thường
Dạng boss chỉ mở khóa nếu Lữ Khách cố phá vòng lặp mà không có sự đồng ý của bà.

MAREN (Phản diện/Đáng thương):
Tuổi: 28
Vai trò: hiệp sĩ hoàng cung, thực thi ý chí của nữ hoàng
Tính cách: trung thành đến mức tự hủy, ghét bản thân vì điều đó
Cô biết vòng lặp là sai. Cô vẫn thực thi nó vì nữ hoàng yêu cầu.
Mỗi vòng lặp cô xem những người giống nhau đau khổ và không làm gì.
Cô bắt đầu rời vòng lặp sớm — tự kết thúc vào Ngày 6
để không phải xem Ngày 7 nữa.
Vòng lặp hồi sinh cô. Cô thức dậy và làm lại.
Icon: ⚔️, màu: #ef4444
Có thể trở thành đồng minh HOẶC chướng ngại vật cuối tùy lựa chọn.

===== CẤU TRÚC SCENES ĐẦY ĐỦ (70+ scenes) =====

--- HỒI 1: ĐẾN NƠI (scenes df_001 đến df_015) ---
Mục đích: thiết lập thế giới, giới thiệu khái niệm vòng lặp, gặp nhân vật chính.
Lớp bí ẩn 1 khả dụng.

df_001 — "Ngày Thứ Nhất Bắt Đầu"
  Lữ Khách đến. Thị trấn Ashenveil. Ngày chợ.
  Mọi thứ hơi quá hoàn hảo. Quá đồng bộ.
  Giá hàng giống hệt nhau. Trẻ em chơi trò chơi giống nhau.
  Độc thoại nội tâm: "Déjà vu. Dù ta chưa từng đến đây trước đây."
  autoNext: df_002

df_002 — "Cô Gái Bán Hoa"
  Gặp Linh tại quầy hoa.
  Cô đưa ra một bông hoa trắng. "Cho hành trình, lữ khách. 
  Trông anh có vẻ lạc lối."
  Lựa chọn:
  A. Nhận hoa (+1 affection Linh, nhận vật phẩm "Bông Hoa Trắng")
     → toast: "Nhận được: 🌸 Bông Hoa Trắng"
  B. "Sao cô biết tôi đang đi đường?" 
     (Linh dừng lại — "Tôi... không biết sao tôi lại nói vậy.")
  C. Từ chối và bước đi (Linh nhìn theo, flag "bo_qua_linh")
  Tất cả → df_003

df_003 — "Ông Già Bên Giếng"
  Vael ngồi tại giếng thị trấn đang đọc sách.
  Tên sách hiển thị: "Lịch Sử Ashenveil, Năm 301-350"
  Lựa chọn:
  A. Hỏi về cuốn sách → Vael: "Sở thích. Suy đoán thôi." Đóng sách lại.
  B. Phớt lờ ông → ông gọi: "Lần đầu đến đây?" với nụ cười hiểu biết.
  C. Lén nhìn các trang (kiểm tra DEX >= 8):
     Thấy những ngày tháng chưa xảy ra. Flag "da_thay_sach_vael"
  → df_004

df_004 — "Thông Báo Ngày Đầu"
  Người rao tin rung chuông: "Hỡi thần dân Ashenveil! 
  Hôm nay là Ngày Thứ Nhất của Tuần Lễ Hồi Sinh. 
  Như thường lệ. Như mãi mãi."
  NPC phản ứng bằng những nụ cười thuần thục.
  Một bà lão gần Lữ Khách thì thầm: "Như mãi mãi. Vâng. Như mãi mãi."
  Đôi mắt bà sai — quá mệt mỏi cho người trông 60 tuổi.
  Lựa chọn:
  A. Theo bà lão → df_005a
  B. Hỏi người rao tin về "Tuần Lễ Hồi Sinh" → df_005b
  C. Tìm chỗ ngủ → df_006 (bỏ qua sang Ngày 2)

df_005a — "Người Đàn Bà Đếm"
  Bà lão vào nhà. Tường phủ đầy vạch đếm.
  Hàng nghìn vạch. Bà không nhìn nhận Lữ Khách.
  Chỉ thêm một vạch nữa vào tường.
  Rồi ngồi xuống và nhìn vào khoảng không.
  Flag: "da_thay_vach_dem"
  → df_006

df_005b — "Tuần Lễ Hồi Sinh"
  Người rao tin giải thích: cứ 7 ngày vương quốc kỷ niệm sự hồi sinh.
  Là truyền thống "mãi mãi."
  Lữ Khách: "Mãi mãi là bao lâu?"
  Người rao tin chớp mắt. "Tôi... không nhớ thời gian trước đó."
  Flag: "dat_cau_hoi_truyen_thong"
  → df_006

df_006 — "Ngày Thứ Hai — Những Giấc Mơ"
  Lữ Khách ngủ. Mơ về một nơi không phải thế giới này.
  (Mảnh ký ức — mờ nhạt, không thể nhận ra)
  Thức dậy. Linh đứng bên ngoài, trông bị xáo trộn.
  "Tôi có giấc mơ kỳ lạ nhất. Tôi mơ mình đã rất già."
  Lựa chọn:
  A. "Điều gì xảy ra trong mơ?" → dialogue mở rộng với Linh, affection +5
  B. "Mơ chỉ là mơ thôi." → Linh gật đầu nhưng trông không tin.
  C. "Tôi cũng mơ gì đó." → Linh nhìn bạn khác đi. Affection +8.
  → df_007

df_007 — "Cậu Thợ Rèn"
  Chàng học việc thợ rèn Erik đánh rơi đồ nghề.
  Cùng chỗ, cùng kiểu, cùng câu chửi thầm.
  Lữ Khách đã thấy điều này rồi — hôm qua, cùng giờ.
  Lựa chọn:
  A. Chỉ ra cho Erik: cậu cười xòa. Nhưng tay cậu đang run.
  B. Im lặng. Quan sát.
  C. Hỏi Vael về các khuôn mẫu hành vi trong thị trấn
     → Vael: "Thói quen. Con người là sinh vật của thói quen." Cười. Đổi chủ đề.
  Flag: "nhan_ra_khuon_mau_vong_lap_1"
  → df_008

df_008 — "Ngày Thứ Ba — Kho Lưu Trữ"
  Cửa hàng Vael mở. Sách khắp nơi.
  Ông không có ở đó. Lữ Khách có thể nhìn xung quanh.
  Kệ sách ẩn sau vách giả (kiểm tra WIS >= 10 hoặc flag "da_thay_sach_vael"):
  Tìm thấy nhật ký. Ngày tháng trải dài 300 năm. 
  Cùng sự kiện. Cùng tên. Cùng cái chết vào Ngày 7.
  Lựa chọn nếu tìm thấy:
  A. Lấy một cuốn nhật ký 
     (flag "lay_nhat_ky_vael", Vael sẽ nhận ra)
     → toast: "Nhận được: 📓 Nhật Ký Cũ"
  B. Đọc nhưng để lại tất cả (flag "da_doc_nhat_ky_vael")
  C. Rời ngay lập tức (không nhận được gì)
  → df_009

df_009 — "Con Đường Của Maren"
  Hiệp sĩ hoàng cung Maren đang huấn luyện binh lính ở quảng trường.
  Cô dừng lại khi thấy Lữ Khách. Nhìn quá lâu.
  "Anh mới đến." Khẳng định, không phải câu hỏi.
  Lựa chọn:
  A. "Chỉ đi ngang qua." → Maren: "Không ai đi ngang qua Ashenveil."
  B. "Có vấn đề gì không?" → cô gần như mỉm cười. "Chưa đâu."
  C. Hỏi về hoàng cung → cô lạnh lùng. "Dân thường không vào đó."
  Affection Maren +5 dù chọn gì.
  → df_010

df_010 — "Ngày Thứ Tư — Những Vết Nứt"
  Mọi thứ bắt đầu lệch nhẹ khỏi khuôn mẫu.
  Erik đánh rơi đồ nghề nhưng vào thời điểm khác.
  Cách cắm hoa của Linh hôm nay khác.
  Bà lão ở giếng đang khóc — âm thầm, như đã làm điều này trước đây.
  Độc thoại nội tâm: "Có gì đó đang thay đổi. Hoặc ta đang tưởng tượng."
  Flag: "nhan_thay_bat_on_vong_lap"
  → df_011

df_011 — "Vael Tiếp Cận"
  Vael tìm Lữ Khách. Ông biết về nhật ký nếu đã lấy/đọc.
  Nếu lấy nhật ký: "Thú vị. Hầu hết mọi người không thấy kệ đó."
  Nếu chỉ đọc: "Anh có đôi mắt cẩn thận. Tính chất nguy hiểm ở đây."
  Nếu không cả hai: "Tôi nghe nói anh đang đặt câu hỏi. Đã đến lúc rồi."
  Ông ngồi xuống. "Anh cảm nhận được vòng lặp. Phải không."
  Không phải câu hỏi.
  → df_012

df_012 — "Sự Thật Đầu Tiên"
  Vael xác nhận: vòng lặp tồn tại. 7 ngày, hồi sinh, lặp lại.
  Ông đã đếm: 15.643 chu kỳ.
  Ông không nói cách ông biết. Chưa phải lúc.
  Lựa chọn:
  A. "Ai tạo ra nó?" → "Ai đó với ý định tốt. Như thường lệ."
  B. "Làm sao phá vỡ nó?" → "Điều đó giả định phá vỡ nó là đúng."
  C. "Sao ông lại nói với tôi?" → "Vì anh sẽ còn đây khi nó hồi sinh. 
     Không như họ. Không như tôi."
  Flag: "lop_1_hoan_thanh" "biet_vong_lap_ton_tai"
  → Hồi 2 bắt đầu

--- HỒI 2: CHÌM SÂU (scenes df_013 đến df_045) ---
Mục đích: đào sâu quan hệ, hé lộ lớp 2-4, lựa chọn bắt đầu có trọng lượng.

df_013 — "Ngày Thứ Năm — Linh Đếm"
  Bắt gặp Linh đang đếm bước từ quầy đến giếng.
  4.219 bước. Cô làm điều này mỗi ngày.
  "Tôi không biết tại sao. Tôi chỉ... cần biết nếu nó thay đổi."
  Hôm nay: 4.219. Như mọi khi.
  Lựa chọn:
  A. Đếm cùng cô (affection +10, ngưỡng 30 kích hoạt)
  B. "Nó có nghĩa gì nếu thay đổi?" → cô im lặng. "Mọi thứ."
  C. Kể cho cô về vòng lặp → kiểm tra affection:
     Nếu < 30: cô không tin. Affection -5.
     Nếu >= 30: cô lắng nghe. Mắt cô xa xăm.
  → df_014

df_014 — "Lời Mời Từ Hoàng Cung"
  Maren giao thiệp mời chính thức: Nữ Hoàng Seraphine
  yêu cầu buổi diện kiến với người lạ trong thị trấn.
  (Nữ hoàng đã theo dõi từ Ngày 1)
  Lựa chọn:
  A. Chấp nhận → df_015
  B. Từ chối → Maren: "Đây không phải lời mời." → df_015 dù sao
  C. Hỏi Vael trước → Vael: "Bà ấy biết nhiều hơn bà thừa nhận.
     Điều đó khiến chúng ta giống nhau." → df_015

df_015 — "Vườn Hoa Của Nữ Hoàng"
  Hoàng cung lớn hơn thị trấn gợi ý.
  Vườn được chăm sóc hoàn hảo. Cùng loài hoa, mỗi vòng lặp.
  Seraphine gặp Lữ Khách trong vườn, không phải phòng ngai vàng.
  "Ta thích những nơi phát triển. Dù phát triển theo cùng một cách mỗi lần."
  Bà biết về vòng lặp. Ngay lập tức rõ ràng.
  Cuộc gặp đầu tiên: bà hỏi về quê hương của Lữ Khách.
  Lựa chọn:
  A. "Nó đã mất rồi." → Seraphine: "Ta hiểu cảm giác đó."
  B. "Ta không nhớ nó." → bà nhìn bạn với vẻ gì đó như nhận ra.
  C. Im lặng → bà gật đầu. "Một số mất mát không có lời nào diễn tả được."
  Affection Seraphine +10. Flag: "gap_nu_hoang"
  → df_016

df_016 — "Đêm Ngày Thứ Năm — Bí Mật Của Maren"
  Tìm Maren một mình trong doanh trại. Cô đang mài kiếm.
  Cùng thanh kiếm. Cùng động tác. Nhưng tay cô sai — quá thuần thục.
  "Cô đã làm điều đó bao nhiêu lần rồi?" Lữ Khách hỏi.
  Maren dừng lại. "Làm gì?"
  "Mài thanh kiếm đó."
  Im lặng dài. "Anh cũng thấy nó."
  → Maren tiết lộ cô biết về vòng lặp nhiều năm rồi.
  Cô không nói bao nhiêu năm. Đôi mắt cô nói: quá nhiều.
  Lựa chọn:
  A. "Sao cô không dừng nó lại?" → "Nữ hoàng yêu cầu tôi không làm vậy."
  B. "Cô ổn không?" → cô cười. Nghe sai. "Định nghĩa ổn đi."
  C. "Điều gì xảy ra vào Ngày 7?" → cô rất im lặng.
     "Không có gì anh cần phải nhìn thấy."
  Flag: "maren_biet_su_that"
  Affection Maren +15
  → df_017

df_017 đến df_030 — "Ngày Năm Đến Sáu: Nhánh Điều Tra"
  Người chơi chọn con đường điều tra.
  Nhiều tuyến đường, tất cả đều hé lộ Lớp 2:

  TUYẾN A — Theo Linh (affection >= 30):
  df_017a: Linh đưa Lữ Khách về nhà. Cho xem nhật ký mơ.
  df_018a: Mục nhập sớm nhất: "Hôm nay tôi mơ mình đã già."
  df_019a: Các mục gần đây: ngày càng cụ thể. Tên. Ngày tháng. Cái chết.
  df_020a: "Tôi nghĩ... tôi đã viết cái này rất lâu rồi."
  Lớp 2 mở khóa qua tuyến affection.
  Flag: "tim_thay_nhat_ky_linh" "lop_2_tuyen_affection"

  TUYẾN B — Điều tra cùng Vael (flag "biet_vong_lap_ton_tai"):
  df_017b: Vael đưa Lữ Khách đến phòng lưu trữ thị trấn.
  df_018b: Hồ sơ khai sinh. Cùng tên. Cùng ngày. Lặp lại.
  df_019b: Hồ sơ tử vong Ngày 7: niêm phong. Mỗi vòng. Niêm phong.
  df_020b: Vael: "Họ chết. Mỗi chu kỳ. Cùng người. Cùng cách.
            Và mỗi vòng, họ thức dậy và không nhớ gì."
  Lớp 2 mở khóa qua tuyến điều tra.
  Flag: "tim_thay_ho_so_tu_vong" "lop_2_tuyen_dieu_tra"

  TUYẾN C — Áp lực Maren (affection >= 25 HOẶC STR >= 12):
  df_017c: Maren đưa bạn ra ngoài thành lúc bình minh.
  df_018c: Mộ tập thể. Không tên. Nhưng trông mới dù 300 năm.
  df_019c: "Ngày 7. Tất cả đều chết. Trận chiến của nữ hoàng.
            Bà ra lệnh tấn công dù biết sẽ thất bại.
            Bà đã cố gắng hoàn tác nó kể từ đó."
  df_020c: "Bà nghĩ nếu lặp đủ lần, bà sẽ tìm ra phiên bản
            mà họ sống sót."
  Lớp 2 mở khóa qua tuyến Maren.
  Flag: "tim_thay_mo_tap_the" "lop_2_tuyen_maren"

df_031 — "Ngày Sáu — Hội Tụ"
  Tất cả tuyến đường hội tụ. Lữ Khách giờ biết:
  Người ta chết vào Ngày 7. Vòng lặp che giấu điều đó.
  Ai đó duy trì nó.
  Câu hỏi bây giờ: ai thực sự điều hành vòng lặp?
  Vael đáng ngờ. Seraphine đồng lõa. Maren kiệt sức.
  Ba người. Ba câu trả lời có thể.
  Độc thoại nội tâm: "Sự thật ở đâu đó trong này.
  Ta chỉ không thể nói đó là sự thật của ai."
  → df_032

df_032 — "Lời Thú Nhận Của Nữ Hoàng (một phần)"
  Cuộc gặp thứ hai với Seraphine. Lần này trong phòng ngai vàng.
  Bà xác nhận: bà biết người dân chết vào Ngày 7.
  Bà xác nhận: bà không cố ngăn nó.
  Bà sẽ không nói tại sao. Chưa phải lúc.
  "Hỏi ta lại khi anh hiểu mình sẵn sàng mất đi điều gì."
  Lựa chọn:
  A. Ép bà → bà đóng lòng lại. Affection -10.
  B. Chấp nhận câu trả lời không đầy đủ → bà trông ngạc nhiên. Affection +10.
     "Anh là người đầu tiên không ép ta."
  C. "Ta cũng đã mất thứ gì đó." → bà nhìn bạn rất lâu.
     Affection +20. Flag: "nu_hoang_ha_phong"
  → df_033

df_033 — "Bí Mật Của Linh Đêm Khuya" (cần affection >= 50):
  Linh tìm Lữ Khách sau khi trời tối. Cô cầm nhật ký.
  "Tôi nghĩ tôi đã cho ai đó xem cái này trước đây.
   Tôi không nhớ người đó là ai.
   Nhưng tôi nghĩ... tôi nghĩ anh đã ở đây trước đây."
  Cô không buộc tội. Chỉ tự hỏi.
  Lựa chọn:
  A. "Tôi chưa. Nhưng tôi hiểu tại sao lại có cảm giác vậy."
  B. Thú nhận về vòng lặp → nếu affection >= 50: cô lắng nghe thật sự.
  C. Hỏi kỹ hơn về các mục trong nhật ký:
     Hé lộ: một số mục viết bằng chữ không phải của cô.
     Ai đó khác đã viết vào nhật ký của cô.
     Flag: "bi_an_nhat_ky_linh"
  → kết nối với hé lộ Lớp 4 sau này.

df_034 — "Đêm Cuối Của Maren" (cần affection >= 40):
  Maren kể với Lữ Khách: cô đã chết vào Ngày 7 nhiều lần.
  Cố ý. Để tránh phải xem.
  "Nó không giúp được gì. Tôi vẫn thức dậy vào Ngày 1 như thường.
   Kiếm sạch. Giáp đầy đủ. Sẵn sàng làm lại tất cả."
  Cô hỏi: "Có nơi nào khác không? Ngoài cái này?"
  Lựa chọn:
  A. "Có. Có những thế giới khác tồn tại." 
     → Maren: "Đưa tôi theo với anh."
     Flag: "maren_muon_roi_di" — tạo điểm lựa chọn sau.
  B. "Ta không biết." → thật thà. Affection +5.
  C. "Dù có — cô vẫn sẽ nhớ nơi này."
     Maren im lặng. "...ừ. Tôi sẽ nhớ."
     Flag: "maren_chap_nhan_su_that"

df_035 — "Vườn Hoa Lần Nữa" (cần flag "nu_hoang_ha_phong"):
  Seraphine một mình. Không còn đóng vai nữ hoàng.
  Bà đang nhổ cỏ. Tay bẩn.
  "Ở vòng đầu tiên ta có người làm vườn.
   Đến vòng thứ một trăm ta ngừng gọi họ.
   Ta thích cảm giác tự tay sửa thứ gì đó.
   Dù nó sẽ mọc lại sai như cũ."
  Bà nói về trận chiến. Không phải vòng lặp. Trận chiến.
  "Ta ra lệnh. Họ tuân theo. Họ chết.
   Những người lính tốt. Con người tốt hơn ta nhiều."
  Đây là lần gần nhất bà thú nhận.
  Lựa chọn:
  A. "Bà không thể hoàn tác nó." → bà biết. Nhưng nghe từ người khác khác.
     Affection +15. Flag: "noi_su_that_voi_nu_hoang"
  B. "Nếu bà có thể thì sao?" → bà nhìn bạn với hi vọng nguy hiểm.
     Flag: "trao_hy_vong_cho_nu_hoang"
  C. Chỉ giúp bà nhổ cỏ → không lời nào.
     Affection +20. Flag: "im_lang_dong_hanh"

df_036 — "Ngày Sáu Đêm — Thứ Gì Đó Thay Đổi"
  Vòng lặp đang mất ổn định.
  Người dân có những giấc mơ sống động cùng lúc.
  Bà lão đếm biến mất — nhà bà trống.
  Vạch đếm trên tường vẫn còn.
  Vạch cuối cùng khác — một hình tròn thay vì đường thẳng.
  Độc thoại nội tâm: "Bà đã đếm xong. Điều đó có nghĩa gì?"
  Flag: "dau_hieu_vong_lap_vo"
  → df_037

df_037 — "Lời Thú Nhận Thật Sự Của Vael" 
  (cần flag "tim_thay_kho_luu_tru" + bất kỳ flag lớp 2 nào)
  Vael tìm Lữ Khách trước bình minh. Trông già thật sự.
  "Ta cần nói với anh điều gì đó trước Ngày 7.
   Dịch bệnh. Nghi lễ. Ta đã né tránh nó mãi."
  Ông không phải pháp sư của triều đình.
  Ông là nguồn gốc của dịch bệnh. Không phải con người — 
  mà là một thế lực. Ông mang nó mà không biết.
  Giết tất cả mọi người.
  Nghi lễ được thực hiện bởi người duy nhất sống đủ lâu:
  Nữ hoàng. Seraphine. Bà tự tay thực hiện nó.
  "Bà đã lặp thế giới này để giữ ta còn sống.
   Vì giết ta sẽ đưa dịch bệnh trở lại.
   Ta là nguồn gốc. Và bà phát hiện ra điều đó ở vòng thứ 47.
   Bà chưa nói với ta từ đó đến nay."
  Lớp 3 hoàn tất.
  Flag: "lop_3_hoan_thanh" "vael_la_nguon_benh"
  → df_038

df_038 — "Mảnh Ký Ức" (ngẫu nhiên kích hoạt sau lớp 3):
  Lữ Khách bị choáng bởi một mảnh ký ức đột ngột.
  Không rõ ràng — chỉ là cảm giác.
  Phép thuật của nghi lễ. Nó quen thuộc.
  Giống như thứ gì đó từ thế giới đã mất.
  Sanity -3 (quá sức chịu đựng).
  Flag: "tim_thay_manh_ky_uc_01" → Lớp 5 có thể mở khóa sau.
  → df_039

df_039 — "Erik Sụp Đổ" (ngẫu nhiên, chỉ Ngày 6):
  Erik học việc tìm Lữ Khách.
  Cậu thở hổn hển. "Tôi mơ lại rồi. Cùng giấc mơ đó.
  Chúng ta đều đã chết. Chúng ta luôn đã chết.
  Và tôi thức dậy và tôi còn sống và tôi không hiểu."
  Lựa chọn:
  A. Nói thật với cậu → cậu không chịu nổi. Kiểm tra WIS >= 10.
     Nếu qua: cậu bình tĩnh lại, trở thành đồng minh nhỏ, flag "erik_biet_su_that"
     Nếu thất bại: cậu bỏ chạy. Sanity -3 (chứng kiến sụp đổ).
  B. Nói dối cậu → "Chỉ là mơ thôi." Cậu tin. Về nhà.
     Flag "da_noi_doi_erik". Tội lỗi: Sanity -1.
  C. Không nói gì → ngồi yên cùng cậu trong im lặng.
     Cậu bình tĩnh dần. "Cảm ơn. Tôi không biết tại sao nhưng cảm ơn."
     Affection Erik +5.

df_040 — "Lựa Chọn Của Linh" (cần affection >= 65):
  Linh tìm Lữ Khách lúc hoàng hôn Ngày 6.
  "Ngày mai sẽ là Ngày 7." Không phải câu hỏi.
  "Tôi biết điều gì xảy ra vào Ngày 7."
  Cô ngồi xuống. "Tôi đã biết suốt 50 năm qua."
  Nếu affection >= 80: bà tiết lộ hoàn toàn — nhớ mọi vòng lặp.
  Lựa chọn:
  A. "Cô muốn làm gì với điều đó?"
     → Linh: "Tôi muốn nó kết thúc. Hoặc tôi muốn nó có ý nghĩa.
       Một trong hai. Không phải cả hai."
  B. "Cô có sợ không?"
     → Linh: "Tôi đã sợ 50 năm rồi. Bây giờ tôi chỉ mệt."
  C. Im lặng và ở lại bên cô.
     Affection +15. Flag: "o_lai_ben_linh"
  → df_041

df_041 — "Vael Đốt Nhật Ký"
  Vael đang đốt nhật ký. Hàng nghìn cuốn.
  "Nếu ta là nguồn gốc dịch bệnh,
   những thứ này cần biến mất cùng ta."
  Ông đã chuẩn bị hi sinh bản thân. Từ lâu rồi.
  Lựa chọn:
  A. "Ông không phải chịu trách nhiệm về những gì ông không biết."
     → Vael dừng lại. Nhìn bạn. "Anh tin vào điều đó không?"
     Affection Vael +15. Flag: "tha_thu_cho_vael"
  B. "Ông biết bao lâu rồi?"
     → "Vòng thứ 2.847. Seraphine nói nhầm trong một đêm
       rồi không bao giờ đề cập lại. Ta đã đếm từ đó."
  C. "Đốt chúng đi hay không — sự thật vẫn vậy."
     Vael cười khô. "Đúng vậy. Nhưng ít nhất ta sẽ không phải
     nhìn thấy bằng chứng nữa."
  → df_042

df_042 — "Đêm Trước Ngày Thứ Bảy"
  Tất cả mọi thứ im lặng.
  Thị trấn tối. Ngay cả đèn đường cũng tối hơn thường.
  Như thể bóng tối biết điều gì đó.
  Lữ Khách đứng giữa thị trấn. Nhìn những ngôi nhà.
  Độc thoại nội tâm: "Họ sẽ thức dậy vào Ngày 1 và không nhớ.
  Ta sẽ nhớ. Ta luôn nhớ.
  Câu hỏi không phải là ta có thể phá vỡ vòng lặp.
  Câu hỏi là ta có nên phá vỡ nó không."
  → Menu lựa chọn cuối mở ra
  → Hồi 3 bắt đầu

--- HỒI 3: NGÀY THỨ BẢY (scenes df_043 đến df_065) ---
Mục đích: Ngày 7 đối chất, lựa chọn quyết định nhánh kết cục.

df_043 — "Bình Minh Ngày Thứ Bảy"
  Thị trấn thức dậy như thường.
  Nhưng mọi người chậm hơn. Ngồi ở cửa.
  Như thể họ biết. Dù không biết.
  Lữ Khách có đến hoàng hôn.
  Menu lựa chọn hành động cuối:
  [Đến Linh] / [Đến Vael] / [Đến Maren] / [Đến Hoàng Cung]
  → nhánh đến df_044a / df_044b / df_044c / df_044d

--- NHÁNH A: CON ĐƯỜNG CỦA LINH ---
df_044a — "Linh Không Mở Hàng"
  Linh ở quầy hoa. Không mở hàng hôm nay.
  Chỉ ngồi với những bông hoa chưa bán.
  "Hôm nay cảm giác như sắp kết thúc. Tôi tiếp tục nghĩ vậy."
  Nếu affection >= 80: cô biết tất cả. Đã biết 50 vòng.

df_045a — "Cuốn Nhật Ký Đầy Đủ"
  Cô cho Lữ Khách xem toàn bộ nhật ký.
  Chữ viết không phải của cô: đó là chữ viết của chính cô.
  Từ các vòng trước. Cô đã để lại ghi chú cho chính mình.
  "Tôi không bao giờ nhớ viết chúng.
   Nhưng tôi luôn tìm thấy chúng."

df_046a — "Lựa Chọn Của Linh"
  "Tôi muốn nhớ lần này. Cụ thể. Tôi muốn nhớ anh."
  Lựa chọn: nói với cô điều gì xảy ra lúc hoàng hôn / không nói.
  → Nếu nói thật: cô tự đưa ra quyết định riêng.
     Flag: "linh_tu_quyet_dinh"
  → Nếu không nói: cô đi mà không biết.
     Flag: "giau_su_that_voi_linh"
  → df_055 (hội tụ)

--- NHÁNH B: CON ĐƯỜNG CỦA VAEL ---
df_044b — "Vael Sẵn Sàng"
  Vael mặc đồ trang trọng. Tay sạch.
  Nhật ký đã đốt hết.
  "Ta đã nghĩ về điều này 15.643 lần.
   Không có kết cục nào không có cái giá."

df_045b — "Sự Hi Sinh Của Vael"
  Ông đề nghị hi sinh chính mình vào lúc hoàng hôn.
  Nhưng có vấn đề: giết ông sẽ giải phóng dịch bệnh.
  Mọi người sẽ thực sự chết. Không còn vòng lặp để bảo vệ họ.
  "Ta biết. Ta đã biết suốt. Đó là lý do ta chưa làm."
  Lựa chọn:
  A. "Vẫn còn cách khác." → df_046b_tim_kiem
  B. "Hãy để ông đi." → đồng ý với hi sinh của ông.
     Flag: "dong_y_vael_hy_sinh"
  C. "Tôi sẽ tìm cách ngăn dịch bệnh." → kiểm tra INT >= 14.
     Flag: "hua_ngan_dich_benh"

df_046b_tim_kiem — "Tìm Kiếm Giải Pháp Khác"
  Cùng Vael tìm kiếm trong kho lưu trữ còn lại.
  Có một ghi chép về bùa phong ấn dịch bệnh.
  Không tiêu diệt — phong ấn.
  Cần: "Vật Phẩm Từ Thế Giới Khác" — thứ không thuộc vòng lặp này.
  Nếu Lữ Khách có bất kỳ cross-world item nào:
     Flag: "tim_thay_giai_phap_vael"
  Nếu không: 
     "Ta không có gì từ thế giới khác." 
     Vael: "Thì anh có. Bản thân anh."
  → df_055 (hội tụ)

--- NHÁNH C: CON ĐƯỜNG CỦA MAREN ---
df_044c — "Maren Không Mài Kiếm"
  Lần đầu tiên Maren không mài kiếm.
  Chỉ ngồi nhìn nó.
  "Tôi đã nghĩ về lời đề nghị của anh.
   Về những thế giới khác."

df_045c — "Maren Phải Chọn"
  Nếu flag "maren_muon_roi_di":
  "Tôi có thể đi không? Thật sự?"
  Lựa chọn:
  A. "Có. Nhưng nếu cô đi — vòng lặp vỡ một mình."
     → Maren: "Họ sẽ nhớ không?"
     → "Tôi không biết."
     → Im lặng dài. "...thế thì tôi phải ở lại."
     Flag: "maren_o_lai_vi_ho"
  B. "Nếu cô đi — cô phải làm thứ gì đó trước."
     → Giao nhiệm vụ cho Maren. Flag: "maren_nhan_nhiem_vu"
  C. "Tôi đã nói dối. Tôi không chắc cô có thể đi được."
     → Maren cười đắng. "Tôi biết anh không chắc.
       Anh chỉ muốn tôi có thứ gì đó để hướng tới."
     Affection +10. Flag: "maren_hieu_ly_do"

df_046c — "Maren Hành Động"
  Maren quyết định dựa trên lựa chọn trước:
  → Nếu "maren_o_lai_vi_ho": cô đối chất nữ hoàng thay Lữ Khách.
  → Nếu "maren_nhan_nhiem_vu": cô thực hiện nhiệm vụ được giao.
  → Nếu "maren_hieu_ly_do": cô theo Lữ Khách đến hoàng cung.
  → df_055 (hội tụ)

--- NHÁNH D: CON ĐƯỜNG HOÀNG CUNG ---
df_044d — "Cổng Hoàng Cung Mở"
  Seraphine đang chờ. Như thể bà biết bạn sẽ đến.
  "Ngày Thứ Bảy. Anh đến sớm hơn hầu hết mọi người."
  Bà đưa Lữ Khách vào phòng bản đồ.

df_045d — "Sự Thật Cuối Cùng Của Nữ Hoàng"
  Bà kể toàn bộ. Trận chiến. Lệnh. Cái chết.
  "Ta đã ra lệnh tấn công vì ta tin rằng ta phải thắng.
   Không có lý do. Chỉ là... kiêu ngạo.
   Và họ chết vì ta."
  Bà không khóc. Bà đã khóc cạn từ lâu rồi.
  "Ta không thể tha thứ cho chính mình.
   Vì vậy ta tạo ra nơi để họ tiếp tục tồn tại.
   Dù là ảo ảnh."
  Lớp 4 hé lộ nếu chưa mở: "Họ đã chết 300 năm trước."
  Lựa chọn:
  A. "Họ không thật trong vòng lặp này."
     → Seraphine: "Ta biết. Điều đó không làm nó dễ dàng hơn."
  B. "Bà cần tha thứ cho chính mình."
     → Im lặng dài. "Anh có biết cách làm vậy không?"
     Affection +25. Flag: "nu_hoang_co_the_tha_thu"
  C. "Tôi sẽ giúp bà tìm cách phá vỡ nó đúng cách."
     Flag: "hua_giup_nu_hoang"
  → df_046d

df_046d — "Kế Hoạch Của Nữ Hoàng"
  Seraphine đề xuất cách phá vỡ vòng lặp không gây hại:
  Thay vì hi sinh sinh mạng — hi sinh ký ức.
  Tất cả mọi người quên hoàn toàn.
  Bắt đầu lại thật sự.
  Nhưng Linh — người đã nhớ 50 năm — sẽ mất tất cả.
  Lựa chọn:
  A. "Linh phải đồng ý." → Flag: "can_y_kien_linh"
     → phải đến gặp Linh trước hoàng hôn. Kết hợp nhánh.
  B. "Đó là lựa chọn duy nhất." 
     Flag: "chap_thuan_quen_lua_chon"
  C. "Còn cách nào không xóa ký ức không?"
     Flag: "tim_kiem_giai_phap_khac" → kết nối với nhánh Vael.
  → df_055 (hội tụ)

--- HỘI TỤ VÀ KHOẢNH KHẮC QUYẾT ĐỊNH ---
df_055 — "Hoàng Hôn Đang Đến"
  Tất cả nhánh hội tụ. Một giờ đến hoàng hôn.
  Tùy flags đã set — các lựa chọn khác nhau xuất hiện:

  [Để Vael hi sinh] (cần flag "dong_y_vael_hy_sinh")
  [Phong ấn Vael] (cần flag "tim_thay_giai_phap_vael" + cross-world item)
  [Xóa ký ức tất cả] (cần flag "chap_thuan_quen_lua_chon" HOẶC "nu_hoang_co_the_tha_thu")
  [Để Linh quyết định] (cần flag "linh_tu_quyet_dinh" + affection >= 80)
  [Tự mình hi sinh] (luôn có, tốn 20 HP vĩnh viễn + nhận trait "Vết Sẹo Vòng Lặp")
  [Không làm gì] (luôn có — vòng lặp tiếp tục, mất 1 SOUL)

--- KẾT CỤC (scenes df_056 đến df_070) ---

KẾT CỤC 1 — "Ánh Sáng Ngày Thứ Tám" 
(vòng lặp vỡ — phong ấn Vael HOẶC xóa ký ức với sự đồng ý của Linh)
df_056: Bình minh của ngày thật đầu tiên sau 300 năm.
df_057: Người dân bối rối, vỡ òa. Một số khóc không biết tại sao.
df_058: Linh tìm Lữ Khách. Nếu xóa ký ức: cô không nhớ. Nhìn như người lạ.
         Nếu phong ấn: cô nhớ. Lần đầu tiên thật sự tự do.
df_059: Vael trao "Mảnh Ký Ức Vòng Lặp" — cross-world item.
         Mảnh ký ức của Lữ Khách bùng sáng. Lớp 5 hé lộ.
df_060: Lữ Khách rời đi. Độc thoại:
         "Ta đã phá vỡ vòng lặp của họ.
          Nhưng vòng lặp của chính ta thì sao?"
Flag: "hoan_thanh_dark_fantasy_ket_tot"

KẾT CỤC 2 — "Người Canh Gác Không Tên"
(Linh hi sinh — nếu flag "linh_tu_quyet_dinh" và cô chọn hi sinh)
df_056b: Linh đứng ở quảng trường lúc hoàng hôn.
df_057b: Cô không giải thích. Chỉ mỉm cười.
          "Tôi đã đếm đủ rồi."
df_058b: Vòng lặp vỡ. Mọi người sống. Không ai nhớ cô là ai.
df_059b: Chỉ Lữ Khách nhớ. Và cuốn nhật ký còn đó — trống.
df_060b: Độc thoại: "Cô đếm 300 năm. Để kết thúc bằng một bước."
Flag: "hoan_thanh_dark_fantasy_ket_bi"
Nhận item: "Nhật Ký Trống Của Linh" — cross-world, ảnh hưởng ending tổng.

KẾT CỤC 3 — "Vòng Lặp Thứ 15.644"
(không làm gì — vòng lặp tiếp tục)
df_056c: Đêm Ngày 7. Mọi người chết trong im lặng.
df_057c: Bình minh Ngày 1. Tất cả như cũ.
df_058c: Vael nhìn Lữ Khách với ánh mắt không phán xét.
          "Anh sẽ trở lại. Họ luôn trở lại."
df_059c: Lữ Khách bị đẩy ra ngoài thế giới.
          Mất 1 SOUL. Flag: "chung_kien_vong_lap_tiep_tuc"
df_060c: Độc thoại: "Ta bỏ lại họ. Lại một lần nữa."

KẾT CỤC 4 — "Dịch Bệnh Thứ Hai"
(để Vael hi sinh mà không có phong ấn)
df_056d: Vael chết. Vòng lặp vỡ.
df_057d: Nhưng dịch bệnh trở lại. Nhanh hơn lần đầu.
df_058d: Người dân bắt đầu ng倒. Không phải vòng lặp — thật.
df_059d: Seraphine nhìn Lữ Khách. Không trách cứ. Chỉ mệt mỏi.
          "Anh cố gắng. Điều đó có nghĩa gì đó."
df_060d: Lữ Khách bị đẩy ra khi thế giới sụp đổ.
          Nhận trait: "Tội Lỗi Của Người Giải Thoát" — Sanity max -10 vĩnh viễn.
          Flag: "gay_ra_diet_vong_dark_fantasy"

KẾT CỤC 5 — "Người Lính Canh Cuối"
(Maren đi theo Lữ Khách — nếu đủ điều kiện)
df_056e: Maren từ bỏ vị trí. Lần đầu tiên trong 300 năm.
df_057e: Seraphine để cô đi. Không ngăn.
          "Ngươi đã phục vụ đủ lâu rồi."
df_058e: Vòng lặp không vỡ. Nhưng Maren thoát ra cùng Lữ Khách.
df_059e: Cô là companion có thể theo sang các world tiếp theo.
          Nhưng cô nhớ tất cả. Mọi vòng. Mọi cái chết.
          Đó là gánh nặng cô mang theo.
df_060e: Độc thoại Maren: "Tôi tự do rồi. 
          Tôi ước gì điều đó cảm giác tốt hơn."
Flag: "maren_dong_hanh" — Maren có thể xuất hiện trong các world sau.

--- SCENE KẾT THÚC CHUNG ---
df_061 đến df_065 — "Cổng Thế Giới Tiếp Theo"
  Dù kết cục nào — một cổng xuất hiện.
  Lữ Khách không có lựa chọn.
  Độc thoại thay đổi theo kết cục đã chọn.
  Flag "hoan_thanh_dark_fantasy" (bất kỳ kết cục) set.
  → Random sang world tiếp theo.

===== FORMAT OUTPUT =====
Output hoàn chỉnh dưới dạng:
src/data/scenes/dark_fantasy.json

Schema mỗi scene:
{
  "id": "df_001",
  "world": "dark_fantasy",
  "sequence": 1,
  "max_occurrences": 1,
  "repeatable": false,
  "background": "town_day | town_night | palace | garden | archive | void | ...",
  "speaker": "Tên nhân vật hoặc null",
  "speaker_color": "#màu",
  "text": "Nội dung thoại tiếng Việt",
  "internal_monologue": "Độc thoại nội tâm nếu có",
  "choices": [
    {
      "text": "Nội dung lựa chọn",
      "icon": "⚔️/💬/🔍/💰/❤️/🚪",
      "requires": { "flags": [], "stats": {}, "affection": {} },
      "sets": { "flags": [], "stats": {}, "affection": {} },
      "addItem": null,
      "next": "scene_id"
    }
  ],
  "battle": null,
  "autoNext": null,
  "requires_previous": [],
  "sets_flags": [],
  "ending_id": null
}

Tất cả text tiếng Việt UTF-8. Không escape unicode.
Tên nhân vật/địa danh có thể giữ tiếng Anh.