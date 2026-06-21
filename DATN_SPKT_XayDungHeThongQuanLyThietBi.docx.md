**ĐẠI HỌC ĐÀ NẴNG**

**TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT**

**KHOA CÔNG NGHỆ SỐ**

**![][image1]**

**ĐỒ ÁN TỐT NGHIỆP**

**ĐẠI HỌC**

**NGÀNH: CÔNG NGHỆ THÔNG TIN**

**CHUYÊN NGÀNH: SƯ PHẠM CÔNG NGHỆ THÔNG TIN**

**ĐỀ TÀI:**

**XÂY DỰNG HỆ THỐNG QUẢN LÝ THIẾT BỊ ĐHSPKT**

	Sinh viên thực hiện	: Nguyễn Thanh Hưng

	Mã sinh viên	: 22115141122105

	Lớp	: 22SK1

	Người hướng dẫn	: **ThS. Phạm Tuấn**

	

**Đà Nẵng, tháng 6/2026**

**ĐẠI HỌC ĐÀ NẴNG**

**TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT**

**KHOA CÔNG NGHỆ SỐ**

**![][image1]**

**ĐỀ TÀI:**

**XÂY DỰNG HỆ THỐNG QUẢN LÝ THIẾT BỊ ĐHSPKT**

	

		Giảng viên hướng dẫn duyệt

**Đà Nẵng, tháng 6/2026**

**NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN**

**NHẬN XÉT CỦA GIÁO VIÊN PHẢN BIỆN**

**TÓM TẮT**

Tên đề tài: Xây dựng hệ thống quản lý thiết bị cho trường ĐHSPKT

Sinh viên thực hiện: Nguyễn Thanh Hưng 	

Mã SV: 22115141122105			Lớp: 22SK1

Nội dung tóm tắt:

Đồ án tập trung nghiên cứu và xây dựng hệ thống phần mềm **Quản lý Thiết bị (QLTHIETBI)** ứng dụng trong môi trường giáo dục của Trường Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng. Hệ thống số hóa toàn bộ vòng đời thiết bị, từ nhập kho, phân bổ sử dụng, bảo trì, kiểm kê định kỳ đến thanh lý, đồng thời cung cấp các báo cáo tổng hợp về giá trị tài sản và tình trạng hoạt động của từng thiết bị.

Sản phẩm được xây dựng trên kiến trúc Full-stack hiện đại sử dụng **Next.js 16 (App Router)** kết hợp **TypeScript**, tầng dữ liệu **Prisma ORM** và cơ sở dữ liệu **PostgreSQL**. Hệ thống phân quyền đa vai trò (**RBAC**) với 5 cấp độ (Admin, Trưởng khoa, Giảng viên, Thủ kho, Sinh viên) được kiểm soát qua lớp **NextAuth.js**, tích hợp bảo mật hai lớp **2FA TOTP** nhằm bảo vệ dữ liệu tài sản nhà trường. Ngoài ra, hệ thống hỗ trợ nhập liệu hàng loạt thiết bị qua file Excel, tạo mã QR cho từng thiết bị, và triển khai dưới dạng **Progressive Web App (PWA)** giúp người dùng truy cập linh hoạt trên nhiều nền tảng.

**LỜI CẢM ƠN**

Lời đầu tiên, em xin bày tỏ lòng biết ơn sâu sắc và chân thành nhất đến quý Thầy, Cô giáo trường Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng, đặc biệt là các Thầy, Cô giáo thuộc Khoa Công nghệ số, những người đã truyền đạt cho em những kiến thức quý báu, nâng đỡ và tạo điều kiện thuận lợi nhất cho em trong suốt quá trình học tập và rèn luyện tại trường.

Đặc biệt, em xin gửi lời cảm ơn sâu sắc nhất tới **ThS. Phạm Tuấn** – người thầy đã trực tiếp hướng dẫn, tận tình chỉ bảo, định hướng và động viên em trong suốt quá trình nghiên cứu và thực hiện đề tài *"Xây dựng hệ thống quản lý thiết bị ĐHSPKT"*. Những lời khuyên, sự định hướng kỹ thuật và những đóng góp quý báu của Thầy là yếu tố quyết định giúp em vượt qua các khó khăn để hoàn thành đồ án tốt nghiệp này một cách trọn vẹn.

Em cũng xin chân thành cảm ơn ban lãnh đạo, các cán bộ quản lý phòng máy và thiết bị tại nhà trường đã tạo điều kiện cho em khảo sát thực tế quy trình nghiệp vụ, cung cấp các thông tin cần thiết để hệ thống xây dựng sát với nhu cầu thực tiễn.

Cuối cùng, em xin cảm ơn gia đình, cùng toàn thể bạn bè lớp 22SK1 đã luôn động viên, chia sẻ và đồng hành cùng em trong suốt chặng đường học tập vừa qua.

Mặc dù đã có nhiều cố gắng, tập trung đầu tư thời gian và tâm huyết để hoàn thiện đồ án, song do kiến thức và kinh nghiệm thực tế của bản thân còn hạn chế, bài báo cáo chắc chắn không tránh khỏi những thiếu sót. Em rất mong nhận được những ý kiến đóng góp, nhận xét và chỉ bảo quý báu của quý Thầy, Cô trong Hội đồng chấm tốt nghiệp để hệ thống của em được hoàn thiện hơn.

Em xin chân thành cảm ơn\!

**LỜI CAM ĐOAN**

	

	

Em xin cam đoan đề tài đồ án tốt nghiệp: *"Xây dựng hệ thống quản lý thiết bị ĐHSPKT"* là công trình nghiên cứu do chính bản thân em thực hiện dưới sự hướng dẫn khoa học độc lập của ThS. Phạm Tuấn.

Các nội dung phân tích, số liệu, kết quả khảo sát kịch bản nghiệp vụ use-case và toàn bộ cấu trúc mã nguồn (sử dụng Next.js, Prisma ORM, PostgreSQL) được trình bày trong tài liệu báo cáo này là hoàn toàn trung thực, khách quan và không sao chép từ bất kỳ công trình, luận văn hoặc đồ án của tác giả nào khác đã được công bố trước đó.

Các tài liệu, mã nguồn tham khảo từ các thư viện mở hoặc các văn bản hệ thống của nhà trường đều được trích dẫn nguồn gốc rõ ràng và có danh mục tài liệu tham khảo kèm theo đúng quy định học thuật.

Nếu có bất kỳ sự gian lận hoặc sao chép không đúng quy định nào được phát hiện, em xin hoàn toàn chịu trách nhiệm trước Hội đồng kỷ luật của Khoa Công nghệ số và trường Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng.	

	

**MỤC LỤC**

[**NHẬN XÉT CỦA GIÁO VIÊN HƯỚNG DẪN	i**](#nhận-xét-của-giáo-viên-hướng-dẫn)

[**NHẬN XÉT CỦA GIÁO VIÊN PHẢN BIỆN	ii**](#nhận-xét-của-giáo-viên-phản-biện)

[**TÓM TẮT	iii**](#tóm-tắt)

[**LỜI CẢM ƠN	iv**](#lời-cảm-ơn)

[**CAM ĐOAN	v**](#lời-cam-đoan)

[**MỤC LỤC	vi**](#mục-lục)

[**DANH MỤC BẢNG BIỂU	viii**](#danh-mục-bảng-biểu)

[**DANH MỤC HÌNH VẼ	ix**](#danh-mục-hình-vẽ)

[**DANH MỤC CHỮ VIẾT TẮT TIẾNG VIỆT	x**](#danh-mục-chữ-viết-tắt-tiếng-việt)

[**DANH MỤC CHỮ VIẾT TẮT TIẾNG ANH	xi**](#danh-mục-chữ-viết-tắt-tiếng-anh)

[**MỞ ĐẦU	1**](#mở-đầu)

[**1.**	**Tổng quan đề tài	1**](#tổng-quan-đề-tài)

[**2.**	**Mục tiêu đề tài	1**](#mục-tiêu-đề-tài)

[**3.**	**Đối tượng nghiên cứu và phạm vi nghiên cứu	1**](#đối-tượng-nghiên-cứu-và-phạm-vi-nghiên-cứu)

[a. Đối tượng nghiên cứu	1](#a.-đối-tượng-nghiên-cứu)

[b. Phạm vi nghiên cứu	1](#b.-phạm-vi-nghiên-cứu)

[**4.**	**Phương pháp nghiên cứu	1**](#phương-pháp-nghiên-cứu)

[**5.**	**Giải pháp công nghệ	1**](#giải-pháp-công-nghệ)

[**6.**	**Cấu trúc đồ án	1**](#cấu-trúc-đồ-án)

[**Chương 1 CƠ SỞ LÝ THUYẾT	2**](#cơ-sở-lý-thuyết)

[**1.1. Tổng quan về Next.js và Kiến trúc App Router	2**](#tổng-quan-về-nextjs-và-kiến-trúc-app-router)

[**1.1.1.** Giới thiệu Next.js	2](#giới-thiệu-nextjs)

[**1.1.2.** App Router và định tuyến dựa trên thư mục	2](#app-router-và-định-tuyến-dựa-trên-thư-mục)

[**1.1.3.** Server Components và Client Components	2](#server-components-và-client-components)

[**1.2. Cơ sở dữ liệu PostgreSQL và Prisma ORM	3**](#cơ-sở-dữ-liệu-postgresql-và-prisma-orm)

[**1.2.1.** Hệ quản trị cơ sở dữ liệu PostgreSQL	3](#hệ-quản-trị-cơ-sở-dữ-liệu-postgresql)

[**1.2.2.** Prisma ORM – Tầng ánh xạ đối tượng	3](#prisma-orm-tầng-ánh-xạ-đối-tượng)

[**1.3. Giải pháp bảo mật: NextAuth, RBAC và 2FA TOTP	3**](#giải-pháp-bảo-mật)

[**1.3.1.** NextAuth.js và quản lý phiên JWT	3](#nextauthjs-và-quản-lý-phiên-jwt)

[**1.3.2.** Kiểm soát truy cập theo vai trò (RBAC)	3](#kiểm-soát-truy-cập-theo-vai-trò)

[**1.3.3.** Xác thực hai yếu tố 2FA TOTP	4](#xác-thực-hai-yếu-tố-2fa-totp)

[**1.4. Các công nghệ hỗ trợ	4**](#các-công-nghệ-hỗ-trợ)

[**Chương 2 PHÂN TÍCH THIẾT KẾ HỆ THỐNG	5**](#phân-tích-thiết-kế-hệ-thống)

[**2.1. Khảo sát yêu cầu	5**](#khảo-sát-yêu-cầu)

[**2.1.1.** Hoạt động nghiệp vụ	5](#hoạt-động-nghiệp-vụ)

[**2.1.2.** Sơ đồ nghiệp vụ thực tế	5](#sơ-đồ-nghiệp-vụ-thực-tế)

[**2.1.3.** Liệt kê người dùng và yêu cầu	5](#liệt-kê-người-dùng-và-yêu-cầu)

[**2.2. Phân tích thiết kế hệ thống	6**](#phân-tích-thiết-kế-hệ-thống-chi-tiết)

[**2.2.1.** Liệt kê Actor và Use case	6](#liệt-kê-actor-và-use-case)

[**2.2.2.** Sơ đồ Use case	6](#sơ-đồ-use-case)

[**2.2.3.** Kịch bản và sơ đồ hoạt động	6](#kịch-bản-và-sơ-đồ-hoạt-động)

[**2.2.4.** Sơ đồ Robustness	8](#sơ-đồ-robustness)

[**2.2.5.** Thiết kế ERD	8](#thiết-kế-erd)

[**2.2.6.** Sơ đồ Class mức 1	8](#sơ-đồ-class-mức-1)

[**2.2.7.** Sơ đồ tuần tự	9](#sơ-đồ-tuần-tự)

[**2.2.8.** Sơ đồ Class mức 2	9](#sơ-đồ-class-mức-2)

[**Chương 3 XÂY DỰNG CHƯƠNG TRÌNH	10**](#xây-dựng-chương-trình)

[**3.1. Công cụ xây dựng chương trình	10**](#công-cụ-xây-dựng-chương-trình)

[**3.2. Cơ sở dữ liệu đã cài đặt trong hệ quản trị CSDL	11**](#cơ-sở-dữ-liệu-đã-cài-đặt)

[**3.3. Giao diện chương trình	14**](#giao-diện-chương-trình)

[**3.3.1.** Giao diện trang đăng nhập	14](#giao-diện-trang-đăng-nhập)

[**3.3.2.** Giao diện Dashboard tổng quan	14](#giao-diện-dashboard-tổng-quan)

[**3.3.3.** Giao diện quản lý thiết bị	14](#giao-diện-quản-lý-thiết-bị)

[**3.3.4.** Giao diện chi tiết thiết bị	15](#giao-diện-chi-tiết-thiết-bị)

[**3.3.5.** Giao diện phiếu nhập kho	15](#giao-diện-phiếu-nhập-kho)

[**3.3.6.** Giao diện quản lý bảo trì	15](#giao-diện-quản-lý-bảo-trì)

[**3.3.7.** Giao diện kiểm kê thiết bị	16](#giao-diện-kiểm-kê-thiết-bị)

[**3.3.8.** Giao diện phân bổ và thanh lý	16](#giao-diện-phân-bổ-và-thanh-lý)

[**3.3.9.** Giao diện báo cáo tổng hợp	16](#giao-diện-báo-cáo-tổng-hợp)

[**3.3.10.** Giao diện nhật ký hoạt động	17](#giao-diện-nhật-ký-hoạt-động)

[**3.3.11.** Giao diện cài đặt tài khoản	17](#giao-diện-cài-đặt-tài-khoản)

[**KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN	18**](#kết-luận-và-hướng-phát-triển)

[**1.**	**Kết luận	18**](#kết-luận)

[**2.**	**Hướng phát triển	18**](#hướng-phát-triển)

[**TÀI LIỆU THAM KHẢO	19**](#tài-liệu-tham-khảo)

**DANH MỤC BẢNG BIỂU**

| Bảng | Tên bảng | Trang |
| :---- | :---- | :---- |
| Bảng 2.1 | Bảng phân tích hoạt động nghiệp vụ | 5 |
| Bảng 2.2 | Bảng liệt kê người dùng và yêu cầu chức năng | 5 |
| Bảng 2.3 | Bảng liệt kê Actor và Use case | 6 |
| Bảng 2.4 | Kịch bản UC01 – Đăng nhập hệ thống tích hợp 2FA | 7 |
| Bảng 2.5 | Kịch bản UC02 – Quản lý thiết bị (CRUD) | 7 |
| Bảng 2.6 | Kịch bản UC03 – Lập phiếu nhập kho | 8 |
| Bảng 2.7 | Mô tả các bảng cơ sở dữ liệu chính | 11 |
| Bảng 3.1 | Danh sách công cụ và thư viện sử dụng | 10 |

**DANH MỤC HÌNH VẼ**

| Hình | Tên hình | Trang |
| :---- | :---- | :---- |
| Hình 2.1 | Sơ đồ nghiệp vụ tổng thể hệ thống QLTHIETBI | 5 |
| Hình 2.2 | Sơ đồ Use case tổng quát | 6 |
| Hình 2.3 | Sơ đồ hoạt động UC01 – Đăng nhập 2FA | 7 |
| Hình 2.4 | Sơ đồ hoạt động UC02 – Quản lý thiết bị | 8 |
| Hình 2.5 | Sơ đồ Robustness – Đăng nhập 2FA | 8 |
| Hình 2.6 | Sơ đồ ERD cơ sở dữ liệu hệ thống | 8 |
| Hình 2.7 | Sơ đồ Class mức 1 | 9 |
| Hình 2.8 | Sơ đồ tuần tự – Đăng nhập 2FA | 9 |
| Hình 2.9 | Sơ đồ Class mức 2 | 9 |
| Hình 3.1 | Giao diện trang đăng nhập | 14 |
| Hình 3.2 | Giao diện Dashboard tổng quan | 14 |
| Hình 3.3 | Giao diện quản lý thiết bị – Danh sách | 14 |
| Hình 3.4 | Giao diện thêm/sửa thiết bị | 15 |
| Hình 3.5 | Giao diện chi tiết thiết bị và mã QR | 15 |
| Hình 3.6 | Giao diện phiếu nhập kho | 15 |
| Hình 3.7 | Giao diện quản lý bảo trì | 15 |
| Hình 3.8 | Giao diện kiểm kê thiết bị | 16 |
| Hình 3.9 | Giao diện phân bổ thiết bị | 16 |
| Hình 3.10 | Giao diện thanh lý thiết bị | 16 |
| Hình 3.11 | Giao diện báo cáo tổng hợp | 16 |
| Hình 3.12 | Giao diện nhật ký hoạt động | 17 |
| Hình 3.13 | Giao diện cài đặt tài khoản | 17 |

**DANH MỤC CHỮ VIẾT TẮT TIẾNG VIỆT**

| Stt | Chữ viết tắt | Giải nghĩa |
| :---: | :---- | :---- |
| 1 | CNTT | Công nghệ thông tin |
| 2 | ĐHSPKT | Đại học Sư phạm Kỹ thuật |
| 3 | CSDL | Cơ sở dữ liệu |
| 4 | QLTHIETBI | Quản lý thiết bị |
| 5 | TB | Thiết bị |
| 6 | NV | Nhân viên |

**DANH MỤC CHỮ VIẾT TẮT TIẾNG ANH**

| Stt | Chữ viết tắt | Giải nghĩa | Nghĩa tiếng Việt |
| :---: | :---- | :---- | :---- |
| 1 | HTML | Hyper Text Markup Language | Ngôn ngữ đánh dấu siêu văn bản |
| 2 | API | Application Programming Interface | Giao diện lập trình ứng dụng |
| 3 | REST | Representational State Transfer | Kiến trúc truyền tải trạng thái đại diện |
| 4 | JWT | JSON Web Token | Mã khóa định danh dạng chuỗi JSON |
| 5 | RBAC | Role-Based Access Control | Kiểm soát truy cập dựa trên vai trò |
| 6 | 2FA | Two-Factor Authentication | Xác thực hai yếu tố |
| 7 | TOTP | Time-Based One-Time Password | Mật khẩu dùng một lần dựa trên thời gian |
| 8 | ORM | Object-Relational Mapping | Ánh xạ đối tượng quan hệ |
| 9 | CRUD | Create, Read, Update, Delete | Các thao tác dữ liệu: Thêm, Đọc, Sửa, Xóa |
| 10 | SSR | Server-Side Rendering | Kết xuất phía máy chủ |
| 11 | SSG | Static Site Generation | Tạo trang tĩnh |
| 12 | PWA | Progressive Web App | Ứng dụng web lũy tiến |
| 13 | UI | User Interface | Giao diện người dùng |
| 14 | UX | User Experience | Trải nghiệm người dùng |
| 15 | QR | Quick Response (Code) | Mã phản hồi nhanh |

	

**MỞ ĐẦU**

1. **Tổng quan đề tài**

Trong bối cảnh chuyển đổi số giáo dục đại học diễn ra mạnh mẽ, việc tối ưu hóa quản lý cơ sở vật chất và thiết bị tại các trường đại học đóng vai trò then chốt quyết định chất lượng giảng dạy và nghiên cứu khoa học. Hiện nay, tại nhiều cơ sở đào tạo, việc theo dõi thiết bị vẫn còn dựa trên các bảng tính Excel rời rạc hoặc các phần mềm quản lý cũ, dẫn đến tình trạng chậm trễ trong cập nhật trạng thái hư hỏng, quy trình bàn giao nhập kho rườm rà và rủi ro mất mát dữ liệu.

Đề tài **"Xây dựng hệ thống quản lý thiết bị ĐHSPKT"** tập trung giải quyết bài toán cốt lõi này bằng cách số hóa toàn bộ vòng đời của thiết bị, từ lúc nhập kho, phân phối sử dụng đến báo hỏng và bảo trì. Hệ thống áp dụng các giải pháp bảo mật hiện đại như cơ chế RBAC và xác thực 2FA giúp khắc phục hoàn toàn những lỗ hổng quản trị mà các nghiên cứu trước đây chưa giải quyết triệt để.

2. **Mục tiêu đề tài**

**Mục tiêu tổng quát:** Xây dựng một ứng dụng web quản lý thiết bị toàn diện, hỗ trợ cán bộ quản lý nắm bắt chính xác số lượng, giá trị tài sản và tình trạng hoạt động của các thiết bị trong nhà trường một cách trực quan, tức thời.

**Mục tiêu cụ thể:**

* Xây dựng module xác thực an toàn hỗ trợ phiên đăng nhập nâng cao và bảo mật 2FA TOTP.  
* Thiết kế giao diện bảng điều khiển (Dashboard) thông minh kết hợp quản lý CRUD thiết bị động.  
* Chuẩn hóa quy trình quản lý phiếu nhập kho, bảo trì, kiểm kê và thanh lý thiết bị trực quan.
* Cung cấp module báo cáo tổng hợp và nhật ký hoạt động hệ thống.
* Hỗ trợ nhập liệu hàng loạt qua Excel và mã QR cho từng thiết bị.

3. **Đối tượng nghiên cứu và phạm vi nghiên cứu**

### **a. Đối tượng nghiên cứu** {#a.-đối-tượng-nghiên-cứu}

Quy trình nghiệp vụ nhập kho, bàn giao, kiểm kê, giám sát tình trạng thiết bị kỹ thuật và các công nghệ phát triển web hiện đại (Next.js, Prisma, PostgreSQL, NextAuth).

### **b. Phạm vi nghiên cứu** {#b.-phạm-vi-nghiên-cứu}

Triển khai thử nghiệm và ứng dụng thực tế áp dụng cho mô hình cơ sở vật chất, phòng máy, thiết bị giảng dạy tại Trường Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng.

4. **Phương pháp nghiên cứu**

**Nghiên cứu lý thuyết:** Tìm hiểu tài liệu chuyên sâu về kiến trúc Web App hiện đại, mô hình cơ sở dữ liệu quan hệ, các giải pháp bảo mật và phân quyền hệ thống.

**Nghiên cứu thực tiễn:** Khảo sát thực tế nhu cầu quản lý thiết bị tại các khoa ban thuộc ĐHSPKT.

**Phương pháp thực nghiệm:** Thực hiện lập trình, cài đặt hệ thống và chạy thử nghiệm (testing) để đánh giá hiệu năng, khả năng chịu tải và tính đúng đắn của chức năng.

5. **Giải pháp công nghệ**

Hệ thống lựa chọn kiến trúc Full-stack hiện đại nhằm đạt được hiệu năng cao và trải nghiệm người dùng tối ưu:

* **Frontend & Backend:** Next.js 16 (App Router) kết hợp ngôn ngữ TypeScript mạnh mẽ.  
* **Giao diện:** Tailwind CSS 4 đảm bảo tính linh hoạt, responsive đa thiết bị mượt mà.  
* **Tầng dữ liệu:** Sử dụng cơ sở dữ liệu quan hệ PostgreSQL kết hợp Prisma ORM 6 để tối ưu hóa truy vấn dữ liệu an toàn.  
* **Xác thực:** Sử dụng thư viện NextAuth.js v5 làm lõi cho việc định danh, hỗ trợ phiên làm việc JWT và bảo mật tăng cường 2FA TOTP.
* **Triển khai:** Progressive Web App (PWA) hỗ trợ truy cập offline và cài đặt trên thiết bị di động.

6. **Cấu trúc đồ án**

Cấu trúc đồ án gồm các phần sau:

**Mở đầu**

Trình bày tính cấp thiết của đề tài trong công cuộc chuyển đổi số công tác quản trị cơ sở vật chất tại Trường Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng. Xác định rõ ràng mục tiêu tổng quát, các mục tiêu cụ thể cần đạt được, đối tượng, phạm vi nghiên cứu, phương pháp luận thực hiện và tóm tắt giải pháp công nghệ tổng thể được lựa chọn áp dụng cho hệ thống.

**Chương 1: Cơ sở lý thuyết**

Tập trung nghiên cứu chuyên sâu về các nền tảng công nghệ và giải pháp kiến trúc phần mềm hiện đại được sử dụng để xây dựng hệ thống **QLTHIETBI**, bao gồm: Next.js App Router, PostgreSQL, Prisma ORM, NextAuth.js, RBAC và 2FA TOTP.

**Chương 2: Phân tích thiết kế hệ thống**

Giai đoạn số hóa và mô hình hóa toàn bộ quy trình nghiệp vụ thực tế tại nhà trường thành các bài toán kỹ thuật phần mềm, bao gồm Use case, ERD, kịch bản hoạt động và sơ đồ lớp.

**Chương 3: Xây dựng chương trình**

Chi tiết hóa quá trình cài đặt mã nguồn thực tế, cấu trúc cơ sở dữ liệu, và minh họa các giao diện người dùng của từng module chức năng.

**Kết luận và hướng phát triển**

Tổng kết toàn bộ các mục tiêu đã đạt được, hạn chế còn tồn tại và đề xuất hướng mở rộng ứng dụng trong tương lai.

---

# **Chương 1: CƠ SỞ LÝ THUYẾT** {#cơ-sở-lý-thuyết}

## **1.1 Tổng quan về Next.js và Kiến trúc App Router** {#tổng-quan-về-nextjs-và-kiến-trúc-app-router}

### **1.1.1 Giới thiệu Next.js** {#giới-thiệu-nextjs}

Next.js là một framework React mã nguồn mở do Vercel phát triển và bảo trì, được thiết kế để tối ưu hóa quá trình xây dựng các ứng dụng web Full-stack hiệu năng cao. Thay vì phải cấu hình riêng biệt cho frontend và backend, Next.js cho phép lập trình viên phát triển cả hai trong cùng một dự án với ngôn ngữ TypeScript nhất quán. Hệ thống **QLTHIETBI** sử dụng **Next.js phiên bản 16.2.3** với **React 19** – phiên bản mới nhất tại thời điểm phát triển.

Những ưu điểm nổi bật của Next.js trong dự án:

* **Tích hợp API Routes:** Cho phép định nghĩa các endpoint REST ngay trong dự án tại thư mục `app/api/`, loại bỏ sự phụ thuộc vào backend framework riêng biệt.
* **Tối ưu hóa tự động:** Tự động tối ưu hình ảnh, font chữ, phân tách bundle JavaScript giúp tăng điểm Core Web Vitals.
* **TypeScript tích hợp sẵn:** Hỗ trợ kiểu dữ liệu tĩnh từ đầu, giảm thiểu lỗi runtime.

### **1.1.2 App Router và định tuyến dựa trên thư mục** {#app-router-và-định-tuyến-dựa-trên-thư-mục}

App Router (giới thiệu từ Next.js 13) là kiến trúc định tuyến thế hệ mới thay thế hoàn toàn Pages Router. Thay vì mapping file sang URL một cách đơn giản, App Router cho phép tổ chức ứng dụng thành các **Route Groups** (nhóm định tuyến) và **Layouts** (bố cục) lồng nhau.

Trong dự án QLTHIETBI, App Router được tổ chức theo hai nhóm chính:

* **`(auth)/`** – Nhóm các trang xác thực (đăng nhập, quên mật khẩu) với layout riêng biệt không có sidebar.
* **`(dashboard)/`** – Nhóm các trang nghiệp vụ chính với layout `AppShell` có thanh điều hướng sidebar đầy đủ.

Cấu trúc này giúp tách biệt hoàn toàn logic bố cục giữa trang công khai và trang nội bộ mà không ảnh hưởng đến cấu trúc URL.

### **1.1.3 Server Components và Client Components** {#server-components-và-client-components}

App Router phân biệt hai loại component:

* **Server Components (mặc định):** Được kết xuất hoàn toàn trên máy chủ. Có khả năng truy xuất cơ sở dữ liệu, đọc biến môi trường và thực thi logic bảo mật mà không cần gửi JavaScript xuống trình duyệt. Hệ thống QLTHIETBI sử dụng Server Components cho các trang hiển thị dữ liệu (danh sách thiết bị, nhật ký, báo cáo).

* **Client Components (`"use client"`):** Được hydrate trên trình duyệt, hỗ trợ tương tác người dùng như form, modal, cập nhật trạng thái. Các panel quản lý CRUD (thêm/sửa/xóa thiết bị, bảo trì, kiểm kê) được xây dựng dưới dạng Client Components.

Sự phân tách này giúp tối ưu hóa đáng kể kích thước JavaScript bundle, đồng thời đảm bảo dữ liệu nhạy cảm chỉ được xử lý phía máy chủ.

---

## **1.2 Cơ sở dữ liệu PostgreSQL và Prisma ORM** {#cơ-sở-dữ-liệu-postgresql-và-prisma-orm}

### **1.2.1 Hệ quản trị cơ sở dữ liệu PostgreSQL** {#hệ-quản-trị-cơ-sở-dữ-liệu-postgresql}

PostgreSQL (hay Postgres) là hệ quản trị cơ sở dữ liệu quan hệ – đối tượng mã nguồn mở với hơn 30 năm phát triển tích cực. PostgreSQL nổi bật với:

* **Toàn vẹn dữ liệu cao:** Hỗ trợ đầy đủ ACID (Atomicity, Consistency, Isolation, Durability), ràng buộc khóa ngoại nghiêm ngặt, kiểm tra CHECK constraint.
* **Kiểu dữ liệu phong phú:** Hỗ trợ JSON, mảng, UUID, Enum, Decimal với độ chính xác cao – đặc biệt cần thiết khi lưu trữ giá trị tài sản thiết bị.
* **Hiệu năng cao:** Tối ưu truy vấn thông qua MVCC (Multi-Version Concurrency Control) và hệ thống index đa dạng.

Trong dự án QLTHIETBI, PostgreSQL được triển khai trên nền tảng cloud **Render**, kết nối thông qua biến môi trường `DATABASE_URL` được mã hóa an toàn.

### **1.2.2 Prisma ORM – Tầng ánh xạ đối tượng** {#prisma-orm-tầng-ánh-xạ-đối-tượng}

Prisma là một ORM (Object-Relational Mapping) thế hệ mới cho Node.js và TypeScript, được sử dụng ở **phiên bản 6.17.1** trong dự án. Prisma gồm ba thành phần chính:

* **Prisma Schema (`schema.prisma`):** Ngôn ngữ khai báo mô hình dữ liệu – là nguồn sự thật duy nhất (Single Source of Truth) cho toàn bộ cấu trúc bảng, mối quan hệ và enum của hệ thống.
* **Prisma Client:** Thư viện truy vấn được tự động sinh ra (auto-generated) dựa trên schema, cung cấp API kiểu tĩnh an toàn, loại bỏ hoàn toàn nguy cơ tấn công SQL Injection.
* **Prisma Migrate:** Công cụ quản lý migration tự động, theo dõi lịch sử thay đổi schema và áp dụng vào cơ sở dữ liệu một cách có kiểm soát.

Ưu điểm cốt lõi: Toàn bộ câu truy vấn đều được kiểm tra kiểu tại thời điểm biên dịch (compile-time type checking), giúp phát hiện lỗi ngay trong quá trình viết code thay vì khi chạy ứng dụng.

---

## **1.3 Giải pháp bảo mật: NextAuth, RBAC và 2FA TOTP** {#giải-pháp-bảo-mật}

### **1.3.1 NextAuth.js và quản lý phiên JWT** {#nextauthjs-và-quản-lý-phiên-jwt}

NextAuth.js (phiên bản 5 – Auth.js) là thư viện xác thực mã nguồn mở chuyên dụng cho Next.js. Hệ thống QLTHIETBI sử dụng NextAuth với **Credentials Provider** – cho phép đăng nhập bằng email và mật khẩu thay vì OAuth.

Luồng xác thực:

1. Người dùng nhập email + mật khẩu (+ mã TOTP nếu đã bật 2FA).
2. Hàm `authorize()` trong `lib/auth.ts` truy vấn bảng `User` qua Prisma, kiểm tra `isActive`, so sánh mật khẩu bằng **bcryptjs**.
3. Nếu tài khoản bật 2FA, mã TOTP được xác thực qua thư viện **speakeasy**.
4. Sau xác thực thành công, NextAuth tạo **JWT** chứa `id`, `role`, `khoaId` của người dùng.
5. Mỗi request tiếp theo đính kèm JWT, middleware đọc và kiểm tra quyền truy cập.
6. Mọi sự kiện đăng nhập/đăng xuất được ghi vào bảng **AuditLog**.

**Lưu trữ mật khẩu:** Mật khẩu được mã hóa một chiều bằng bcrypt với salt rounds = 12, đảm bảo không thể khôi phục ngược.

### **1.3.2 Kiểm soát truy cập theo vai trò (RBAC)** {#kiểm-soát-truy-cập-theo-vai-trò}

Role-Based Access Control (RBAC) là mô hình bảo mật phân quyền dựa trên vai trò của người dùng. Hệ thống QLTHIETBI định nghĩa **5 vai trò** với cấp độ quyền hạn khác nhau:

| Vai trò | Mã định danh | Quyền hạn chính |
| :---- | :---- | :---- |
| Quản trị viên | `ADMIN` | Toàn quyền hệ thống, xem nhật ký, quản lý tài khoản |
| Trưởng khoa | `TRUONG_KHOA` | Xem báo cáo, phê duyệt, theo dõi thiết bị trong khoa |
| Thủ kho | `THU_KHO` | Quản lý thiết bị CRUD, nhập kho, kiểm kê |
| Giảng viên | `GIANG_VIEN` | Xem thiết bị trong khoa, gửi yêu cầu bảo trì |
| Sinh viên | `SINH_VIEN` | Xem thiết bị khả dụng, mượn thiết bị |

Cơ chế kiểm soát được thực thi ở hai lớp:

* **Lớp Middleware (`proxy.ts`):** Chặn request trước khi vào route, kiểm tra JWT và vai trò, chuyển hướng về `/unauthorized` nếu không đủ quyền.
* **Lớp API Route:** Mỗi API endpoint gọi `auth()` để xác thực phiên, áp dụng lọc dữ liệu theo `khoaId` của người dùng (ví dụ: Giảng viên chỉ thấy thiết bị của khoa mình).

### **1.3.3 Xác thực hai yếu tố 2FA TOTP** {#xác-thực-hai-yếu-tố-2fa-totp}

TOTP (Time-Based One-Time Password) theo chuẩn RFC 6238 là phương thức sinh mã xác thực dùng một lần dựa trên thời gian thực. Nguyên lý hoạt động:

* Khi bật 2FA, hệ thống sinh **secret key** ngẫu nhiên và lưu (mã hóa) vào cột `twoFactorSecret` của bảng `User`.
* Ứng dụng xác thực trên điện thoại (Google Authenticator, Authy) đồng bộ secret này và sinh mã 6 chữ số mới mỗi 30 giây.
* Khi đăng nhập, người dùng nhập thêm mã TOTP hiện tại – thư viện **speakeasy** xác minh mã có hợp lệ trong cửa sổ thời gian cho phép.

Ưu điểm: Ngay cả khi kẻ tấn công có mật khẩu, họ vẫn không thể đăng nhập nếu không có thiết bị vật lý của người dùng.

---

## **1.4 Các công nghệ hỗ trợ** {#các-công-nghệ-hỗ-trợ}

**TypeScript:** Ngôn ngữ lập trình mở rộng của JavaScript với hệ thống kiểu tĩnh mạnh, giúp phát hiện lỗi tại thời điểm biên dịch và cải thiện khả năng bảo trì mã nguồn.

**Tailwind CSS 4:** Framework CSS tiện ích (utility-first) cho phép xây dựng giao diện responsive nhanh chóng bằng cách áp dụng trực tiếp các lớp CSS vào JSX, không cần viết file CSS riêng biệt.

**Zod:** Thư viện khai báo và xác thực schema TypeScript được sử dụng để kiểm tra toàn bộ dữ liệu đầu vào tại các API endpoint, ngăn chặn dữ liệu sai định dạng trước khi lưu vào cơ sở dữ liệu.

**React Hook Form:** Thư viện quản lý biểu mẫu phía client với hiệu năng cao, tích hợp với Zod để hiển thị lỗi xác thực tức thời cho người dùng.

**TanStack Table:** Thư viện bảng dữ liệu headless mạnh mẽ, hỗ trợ sắp xếp, lọc, phân trang và tùy chỉnh hoàn toàn giao diện.

**Progressive Web App (PWA):** Hệ thống được triển khai dưới dạng PWA với Service Worker, cho phép cài đặt trên thiết bị di động và truy cập trang offline.

---

# **Chương 2: PHÂN TÍCH THIẾT KẾ HỆ THỐNG** {#phân-tích-thiết-kế-hệ-thống}

## **2.1 Khảo sát yêu cầu** {#khảo-sát-yêu-cầu}

### **2.1.1 Hoạt động nghiệp vụ** {#hoạt-động-nghiệp-vụ}

Qua quá trình khảo sát thực tế tại Trường Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng, quy trình quản lý thiết bị hiện tại được xác định gồm các hoạt động chính sau:

**Bảng 2.1: Bảng phân tích hoạt động nghiệp vụ**

| STT | Hoạt động | Mô tả | Vấn đề hiện tại |
| :---- | :---- | :---- | :---- |
| 1 | Nhập kho thiết bị | Tiếp nhận thiết bị mới, ghi nhận thông tin, số lượng từ nhà cung cấp | Ghi tay vào sổ, dễ sai sót |
| 2 | Phân bổ thiết bị | Điều chuyển thiết bị đến các khoa, phòng học | Không theo dõi lịch sử di chuyển |
| 3 | Theo dõi tình trạng | Giám sát trạng thái hoạt động (Tốt/Hỏng/Bảo trì) | Thông tin rải rác trên nhiều file Excel |
| 4 | Bảo trì, sửa chữa | Ghi nhận yêu cầu bảo trì, theo dõi tiến độ xử lý | Không có hệ thống theo dõi tập trung |
| 5 | Kiểm kê định kỳ | Đối chiếu số lượng thực tế với hồ sơ sổ sách | Tốn nhiều thời gian, sai lệch số liệu |
| 6 | Thanh lý thiết bị | Xử lý thiết bị hết khấu hao, hư hỏng nặng | Thủ tục rườm rà, thiếu minh bạch |
| 7 | Báo cáo tài sản | Tổng hợp giá trị tài sản, thống kê theo khoa | Phụ thuộc vào việc tổng hợp thủ công |

### **2.1.2 Sơ đồ nghiệp vụ thực tế** {#sơ-đồ-nghiệp-vụ-thực-tế}

*(Hình 2.1: Sơ đồ nghiệp vụ tổng thể hệ thống QLTHIETBI – vẽ theo ký hiệu BPMN)*

### **2.1.3 Liệt kê người dùng và yêu cầu** {#liệt-kê-người-dùng-và-yêu-cầu}

**Bảng 2.2: Bảng liệt kê người dùng và yêu cầu chức năng**

| Vai trò | Yêu cầu chức năng |
| :---- | :---- |
| **Quản trị viên (Admin)** | Quản lý toàn bộ tài khoản người dùng; xem nhật ký hoạt động hệ thống; truy cập tất cả module; cấu hình phân quyền |
| **Trưởng khoa (Truong Khoa)** | Xem báo cáo tổng hợp giá trị tài sản; theo dõi thiết bị trong khoa; xem lịch sử phân bổ và thanh lý |
| **Thủ kho (Thu Kho)** | Quản lý CRUD thiết bị; lập phiếu nhập kho; tổ chức đợt kiểm kê; cập nhật trạng thái bảo trì; import Excel hàng loạt |
| **Giảng viên (Giang Vien)** | Xem danh sách thiết bị trong khoa; xem chi tiết thiết bị; gửi yêu cầu bảo trì; tra cứu QR thiết bị |
| **Sinh viên (Sinh Vien)** | Xem danh sách thiết bị khả dụng trong phòng học; mượn/trả thiết bị (theo kế hoạch) |

**Yêu cầu phi chức năng:**

* **Bảo mật:** Mật khẩu mã hóa bcrypt, JWT ký bằng secret key, RBAC kiểm soát từng route, 2FA TOTP tùy chọn.
* **Hiệu năng:** Trang tải dưới 3 giây với dữ liệu thực, API phân trang tránh over-fetching.
* **Khả dụng:** PWA hỗ trợ offline, responsive hoạt động tốt trên mobile và desktop.
* **Kiểm toán:** Mọi thao tác CRUD được ghi vào AuditLog để truy vết.

---

## **2.2 Phân tích thiết kế hệ thống** {#phân-tích-thiết-kế-hệ-thống-chi-tiết}

### **2.2.1 Liệt kê Actor và Use case** {#liệt-kê-actor-và-use-case}

**Bảng 2.3: Bảng liệt kê Actor và Use case**

| STT | Use case | Admin | Trưởng khoa | Thủ kho | Giảng viên | Sinh viên |
| :---- | :---- | :---: | :---: | :---: | :---: | :---: |
| UC01 | Đăng nhập hệ thống (tích hợp 2FA) | ✓ | ✓ | ✓ | ✓ | ✓ |
| UC02 | Đăng xuất hệ thống | ✓ | ✓ | ✓ | ✓ | ✓ |
| UC03 | Đổi mật khẩu | ✓ | ✓ | ✓ | ✓ | ✓ |
| UC04 | Xem danh sách thiết bị | ✓ | ✓ | ✓ | ✓ | ✓ |
| UC05 | Xem chi tiết thiết bị (QR) | ✓ | ✓ | ✓ | ✓ | |
| UC06 | Thêm/Sửa/Xóa thiết bị | ✓ | | ✓ | | |
| UC07 | Import thiết bị từ Excel | ✓ | | ✓ | | |
| UC08 | Lập phiếu nhập kho | ✓ | | ✓ | | |
| UC09 | Quản lý bảo trì | ✓ | | ✓ | ✓ | |
| UC10 | Tổ chức đợt kiểm kê | ✓ | | ✓ | | |
| UC11 | Xem phân bổ thiết bị | ✓ | ✓ | ✓ | ✓ | |
| UC12 | Thanh lý thiết bị | ✓ | | ✓ | | |
| UC13 | Xem báo cáo tổng hợp | ✓ | ✓ | | | |
| UC14 | Xem nhật ký hoạt động | ✓ | | | | |
| UC15 | Mượn/trả thiết bị | ✓ | ✓ | ✓ | ✓ | ✓ |

### **2.2.2 Sơ đồ Use case** {#sơ-đồ-use-case}

*(Hình 2.2: Sơ đồ Use case tổng quát hệ thống QLTHIETBI)*

### **2.2.3 Kịch bản và sơ đồ hoạt động** {#kịch-bản-và-sơ-đồ-hoạt-động}

**Bảng 2.4: Kịch bản UC01 – Đăng nhập hệ thống tích hợp 2FA**

| Thành phần thuộc tính | Chi tiết nội dung kịch bản |
| :---- | :---- |
| **Use-case name** | Đăng nhập hệ thống tích hợp 2FA |
| **Description** | Người dùng xác thực danh tính để truy cập vào hệ thống quản lý thiết bị |
| **Actors** | Tất cả người dùng (Admin, Trưởng khoa, Thủ kho, Giảng viên, Sinh viên) |
| **Precondition** | Người dùng có tài khoản hoạt động trong hệ thống |
| **Postcondition** | Người dùng được cấp JWT và chuyển hướng đến Dashboard |
| **Basic flow** | 1. Người dùng truy cập trang `/login`. 2. Nhập địa chỉ email và mật khẩu. 3. Nhấn nút "Đăng nhập". 4. Hệ thống xác thực thông tin qua Prisma + bcrypt. 5. Nếu tài khoản không bật 2FA: hệ thống tạo JWT và chuyển hướng đến `/dashboard`. 6. Nếu tài khoản bật 2FA: hệ thống yêu cầu nhập mã TOTP 6 chữ số. 7. Hệ thống xác thực mã TOTP qua speakeasy. 8. Tạo JWT, ghi AuditLog và chuyển hướng đến `/dashboard` – Kết thúc use case. |
| **Alternative flow** | 5a. Tài khoản đã bật 2FA → bước 6. |
| **Exception flow** | 4a. Email không tồn tại hoặc mật khẩu sai → hiển thị thông báo lỗi "Thông tin đăng nhập không chính xác". 4b. Tài khoản bị vô hiệu hóa (`isActive = false`) → hiển thị thông báo "Tài khoản đã bị khóa". 7a. Mã TOTP sai hoặc hết hạn → hiển thị thông báo lỗi, yêu cầu nhập lại. |

*(Hình 2.3: Sơ đồ hoạt động UC01 – Đăng nhập 2FA)*

**Bảng 2.5: Kịch bản UC06 – Quản lý thiết bị (Thêm mới thiết bị)**

| Thành phần thuộc tính | Chi tiết nội dung kịch bản |
| :---- | :---- |
| **Use-case name** | Thêm mới thiết bị |
| **Description** | Cán bộ quản lý thêm thông tin thiết bị mới vào hệ thống |
| **Actors** | Quản trị viên (Admin), Thủ kho |
| **Precondition** | Actor đã đăng nhập thành công, có vai trò ADMIN hoặc THU_KHO |
| **Postcondition** | Bản ghi thiết bị mới được lưu vào bảng `ThietBi`, AuditLog ghi nhận hành động |
| **Basic flow** | 1. Actor chọn mục "Quản lý thiết bị" trên sidebar. 2. Nhấn nút "Thêm thiết bị". 3. Form thêm mới hiện ra với các trường: Tên, Mã thiết bị, Số Serial, Danh mục, Nhà cung cấp, Phòng, Khoa, Giá trị ban đầu, Năm mua. 4. Actor điền đầy đủ thông tin và nhấn "Lưu". 5. Hệ thống xác thực dữ liệu qua Zod schema. 6. API `/api/thiet-bi` (POST) gọi Prisma tạo bản ghi mới. 7. Hệ thống thông báo "Thêm thiết bị thành công" và cập nhật danh sách – Kết thúc use case. |
| **Alternative flow** | 2a. Actor nhấn nút "Sửa" trên một thiết bị hiện có → form chứa thông tin cũ, nhấn "Lưu" gọi API PATCH → cập nhật thành công. 2b. Actor nhấn "Xóa" → hộp thoại xác nhận → gọi API DELETE → xóa thành công. |
| **Exception flow** | 5a. Dữ liệu không hợp lệ (thiếu trường bắt buộc, sai định dạng) → hiển thị lỗi ngay tại trường tương ứng. 5b. Mã thiết bị hoặc Số Serial đã tồn tại → thông báo "Mã thiết bị đã tồn tại trong hệ thống". |

*(Hình 2.4: Sơ đồ hoạt động UC06 – Quản lý thiết bị)*

**Bảng 2.6: Kịch bản UC08 – Lập phiếu nhập kho**

| Thành phần thuộc tính | Chi tiết nội dung kịch bản |
| :---- | :---- |
| **Use-case name** | Lập phiếu nhập kho |
| **Description** | Thủ kho tạo chứng từ ghi nhận việc nhập thiết bị mới từ nhà cung cấp |
| **Actors** | Quản trị viên (Admin), Thủ kho |
| **Precondition** | Actor đã đăng nhập, có tài khoản nhà cung cấp trong hệ thống |
| **Postcondition** | Phiếu nhập kho được tạo, thông tin thiết bị được cập nhật |
| **Basic flow** | 1. Actor chọn mục "Phiếu nhập" trên sidebar. 2. Nhấn "Tạo phiếu mới". 3. Chọn nhà cung cấp từ danh sách. 4. Thêm các dòng thiết bị: Tên thiết bị, số lượng, đơn giá. 5. Kiểm tra lại thông tin và nhấn "Lưu phiếu". 6. Hệ thống tạo phiếu nhập và thông báo thành công – Kết thúc use case. |
| **Alternative flow** | 5a. Nhấn "Lưu nháp" → phiếu lưu ở trạng thái `CHO_DUYET`. |
| **Exception flow** | 3a. Nhà cung cấp chưa có trong hệ thống → thông báo yêu cầu thêm nhà cung cấp trước. |

*(Sơ đồ hoạt động UC08 – xem Hình 2.X)*

### **2.2.4 Sơ đồ Robustness** {#sơ-đồ-robustness}

*(Hình 2.5: Sơ đồ Robustness cho UC01 – Đăng nhập tích hợp 2FA, thể hiện các boundary objects, control objects và entity objects)*

### **2.2.5 Thiết kế ERD** {#thiết-kế-erd}

*(Hình 2.6: Sơ đồ ERD toàn bộ hệ thống QLTHIETBI – tham khảo file `docs/ERD.md`)*

Hệ thống cơ sở dữ liệu gồm các nhóm bảng chính:

* **Nhóm người dùng & tổ chức:** `User`, `Khoa`, `Phong` – quản lý tài khoản và cơ cấu tổ chức.
* **Nhóm danh mục:** `DanhMucThietBi`, `NhaCungCap` – thông tin phân loại và nhà cung cấp.
* **Nhóm thiết bị:** `ThietBi`, `LichSuDiChuyen` – dữ liệu tài sản và lịch sử di chuyển.
* **Nhóm nghiệp vụ:** `BaoTri`, `DotKiemKe`, `KiemKeItem`, `PhieuMuon` – các module nghiệp vụ.
* **Nhóm hệ thống:** `AuditLog`, `Account`, `Session`, `VerificationToken`, `Authenticator` – bảng phục vụ xác thực và kiểm toán.

Các **Enum** được định nghĩa:

* `Role`: `ADMIN` | `TRUONG_KHOA` | `GIANG_VIEN` | `THU_KHO` | `SINH_VIEN`
* `TrangThaiThietBi`: `TOT` | `HONG` | `BAO_TRI` | `THANH_LY` | `CHO_DUYET`
* `TrangThaiPhiếu`: `CHO_DUYET` | `DA_DUYET` | `TU_CHOI` | `DANG_MUON` | `DA_TRA` | `QUA_HAN`

### **2.2.6 Sơ đồ Class mức 1** {#sơ-đồ-class-mức-1}

*(Hình 2.7: Sơ đồ Class mức 1 – thể hiện các lớp nghiệp vụ chính và mối quan hệ giữa User, ThietBi, BaoTri, DotKiemKe, AuditLog mà chưa có phương thức)*

### **2.2.7 Sơ đồ tuần tự** {#sơ-đồ-tuần-tự}

*(Hình 2.8: Sơ đồ tuần tự UC01 – Đăng nhập 2FA, thể hiện tương tác giữa: Browser → Next.js Server → NextAuth → Prisma DB → speakeasy)*

### **2.2.8 Sơ đồ Class mức 2** {#sơ-đồ-class-mức-2}

*(Hình 2.9: Sơ đồ Class mức 2 – bổ sung các phương thức rút ra từ sơ đồ tuần tự: `authorize()`, `validateTOTP()`, `recordAuditLog()`, `findDeviceById()`, `updateDevice()`, v.v.)*

---

# **Chương 3: XÂY DỰNG CHƯƠNG TRÌNH** {#xây-dựng-chương-trình}

## **3.1 Công cụ xây dựng chương trình** {#công-cụ-xây-dựng-chương-trình}

**Bảng 3.1: Danh sách công cụ và thư viện sử dụng**

| STT | Công cụ / Thư viện | Phiên bản | Mục đích sử dụng |
| :---: | :---- | :---- | :---- |
| 1 | Node.js | 20.x LTS | Môi trường runtime JavaScript phía máy chủ |
| 2 | npm | 10.x | Quản lý gói và chạy script dự án |
| 3 | Next.js | 16.2.3 | Framework Full-stack (App Router) |
| 4 | React | 19.2.4 | Thư viện xây dựng giao diện UI |
| 5 | TypeScript | 5.x | Ngôn ngữ lập trình với kiểm tra kiểu tĩnh |
| 6 | Tailwind CSS | 4.x | Framework CSS Utility-first |
| 7 | PostgreSQL | 16.x | Hệ quản trị cơ sở dữ liệu quan hệ |
| 8 | Prisma ORM | 6.17.1 | Tầng ánh xạ đối tượng, quản lý migration |
| 9 | NextAuth.js | 5.0.0-beta.30 | Xác thực và quản lý phiên làm việc JWT |
| 10 | bcryptjs | 2.4.3 | Mã hóa mật khẩu một chiều (hash) |
| 11 | speakeasy | 2.0.0 | Tạo và xác thực mã TOTP 2FA |
| 12 | Zod | 4.x | Khai báo schema và xác thực dữ liệu đầu vào |
| 13 | React Hook Form | 7.x | Quản lý và xác thực biểu mẫu phía client |
| 14 | TanStack Table | 8.x | Bảng dữ liệu có sắp xếp, lọc và phân trang |
| 15 | xlsx | 0.18.x | Đọc/phân tích file Excel để nhập liệu hàng loạt |
| 16 | qrcode | 1.5.x | Tạo mã QR cho từng thiết bị |
| 17 | lucide-react | Latest | Bộ icon vector dạng React component |
| 18 | date-fns | 3.x | Tiện ích xử lý và định dạng ngày giờ |
| 19 | VS Code / Cursor AI | Latest | Môi trường phát triển tích hợp (IDE) |
| 20 | Git + GitHub | - | Quản lý phiên bản và lưu trữ mã nguồn |
| 21 | Render | - | Nền tảng cloud hosting PostgreSQL |

**Cấu trúc thư mục dự án:**

```
qlthietbi/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Nhóm trang xác thực
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (dashboard)/        # Nhóm trang nghiệp vụ (có AppShell)
│   │   ├── thiet-bi/       # Quản lý thiết bị
│   │   ├── phieu-nhap/     # Phiếu nhập kho
│   │   ├── bao-tri/        # Bảo trì
│   │   ├── kiem-ke/        # Kiểm kê
│   │   ├── phan-bo/        # Phân bổ
│   │   ├── thanh-ly/       # Thanh lý
│   │   ├── bao-cao/        # Báo cáo
│   │   └── nhat-ky-hoat-dong/ # Nhật ký
│   ├── api/                # REST API endpoints
│   └── actions/            # Next.js Server Actions
├── components/             # React components tái sử dụng
├── lib/                    # Tiện ích dùng chung
│   ├── auth.ts             # Cấu hình NextAuth
│   ├── prisma.ts           # Prisma singleton
│   ├── audit.ts            # Ghi nhật ký
│   └── validations/        # Zod schemas
├── prisma/
│   ├── schema.prisma       # Định nghĩa schema CSDL
│   └── migrations/         # Lịch sử migration
└── types/                  # TypeScript type definitions
```

---

## **3.2 Cơ sở dữ liệu đã cài đặt trong hệ quản trị CSDL** {#cơ-sở-dữ-liệu-đã-cài-đặt}

Cơ sở dữ liệu hệ thống **QLTHIETBI** được thiết kế và cài đặt trên PostgreSQL, quản lý bởi Prisma ORM thông qua file `prisma/schema.prisma`. Dưới đây là mô tả chi tiết các bảng dữ liệu chính:

**Bảng `User` – Tài khoản người dùng**

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :---- | :---- | :---- | :---- |
| `id` | String (UUID) | PK | Định danh duy nhất |
| `email` | String | UK, NOT NULL | Địa chỉ email đăng nhập |
| `password` | String | NOT NULL | Mật khẩu đã mã hóa bcrypt |
| `name` | String | NOT NULL | Họ và tên |
| `maSoNV` | String | UK | Mã số nhân viên/sinh viên |
| `role` | Enum Role | NOT NULL | Vai trò: ADMIN/TRUONG_KHOA/GIANG_VIEN/THU_KHO/SINH_VIEN |
| `isActive` | Boolean | DEFAULT true | Trạng thái hoạt động của tài khoản |
| `khoaId` | String | FK → Khoa | Khoa mà người dùng thuộc về |
| `twoFactorEnabled` | Boolean | DEFAULT false | Trạng thái bật/tắt 2FA |
| `twoFactorSecret` | String | NULLABLE | Khóa bí mật TOTP (mã hóa) |
| `createdAt` | DateTime | AUTO | Thời điểm tạo tài khoản |
| `updatedAt` | DateTime | AUTO | Thời điểm cập nhật gần nhất |

**Bảng `Khoa` – Khoa/Đơn vị**

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :---- | :---- | :---- | :---- |
| `id` | String (UUID) | PK | Định danh duy nhất |
| `maKhoa` | String | UK, NOT NULL | Mã khoa (ví dụ: CNSO, KTCK) |
| `tenKhoa` | String | NOT NULL | Tên đầy đủ của khoa |
| `createdAt` | DateTime | AUTO | Thời điểm tạo |

**Bảng `Phong` – Phòng học/Phòng máy**

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :---- | :---- | :---- | :---- |
| `id` | String (UUID) | PK | Định danh duy nhất |
| `maPhong` | String | UK, NOT NULL | Mã phòng |
| `tenPhong` | String | NOT NULL | Tên phòng |
| `loaiPhong` | String | NULLABLE | Loại phòng (phòng học, phòng lab, v.v.) |
| `khoaId` | String | FK → Khoa | Khoa quản lý phòng |

**Bảng `ThietBi` – Thiết bị (bảng trung tâm)**

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :---- | :---- | :---- | :---- |
| `id` | String (UUID) | PK | Định danh duy nhất |
| `maThietBi` | String | UK, NOT NULL | Mã thiết bị |
| `serialNumber` | String | UK, NOT NULL | Số serial vật lý |
| `tenThietBi` | String | NOT NULL | Tên thiết bị |
| `giaTriBanDau` | Decimal | NOT NULL | Giá trị ban đầu (đồng) |
| `trangThai` | Enum TrangThaiThietBi | NOT NULL | Trạng thái: TOT/HONG/BAO_TRI/THANH_LY/CHO_DUYET |
| `danhMucId` | String | FK → DanhMucThietBi | Danh mục thiết bị |
| `nhaCungCapId` | String | FK → NhaCungCap | Nhà cung cấp |
| `khoaId` | String | FK → Khoa | Khoa đang sử dụng |
| `phongId` | String | FK → Phong | Phòng hiện tại |
| `createdAt` | DateTime | AUTO | Ngày nhập kho |
| `updatedAt` | DateTime | AUTO | Ngày cập nhật gần nhất |

**Bảng `BaoTri` – Bảo trì**

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :---- | :---- | :---- | :---- |
| `id` | String (UUID) | PK | Định danh duy nhất |
| `thietBiId` | String | FK → ThietBi | Thiết bị cần bảo trì |
| `kyThuatVienId` | String | FK → User | Kỹ thuật viên phụ trách |
| `loaiBaoTri` | String | NOT NULL | Loại bảo trì (định kỳ/khẩn cấp) |
| `moTaVanDe` | String | NOT NULL | Mô tả vấn đề |
| `ketQua` | String | NULLABLE | Kết quả sau bảo trì |
| `chiPhi` | Decimal | DEFAULT 0 | Chi phí bảo trì |
| `ngayBatDau` | DateTime | NOT NULL | Ngày bắt đầu |
| `ngayHoanThanh` | DateTime | NULLABLE | Ngày hoàn thành |
| `createdAt` | DateTime | AUTO | Ngày tạo phiếu |

**Bảng `DotKiemKe` – Đợt kiểm kê**

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :---- | :---- | :---- | :---- |
| `id` | String (UUID) | PK | Định danh duy nhất |
| `tenDot` | String | NOT NULL | Tên đợt kiểm kê |
| `ngayBatDau` | DateTime | NOT NULL | Ngày bắt đầu kiểm kê |
| `ngayKetThuc` | DateTime | NULLABLE | Ngày kết thúc kiểm kê |
| `trangThai` | String | NOT NULL | Trạng thái đợt kiểm kê |
| `nguoiTao` | String | NOT NULL | Người tạo đợt kiểm kê |
| `createdAt` | DateTime | AUTO | Thời điểm tạo |

**Bảng `AuditLog` – Nhật ký hoạt động**

| Thuộc tính | Kiểu dữ liệu | Ràng buộc | Mô tả |
| :---- | :---- | :---- | :---- |
| `id` | String (UUID) | PK | Định danh duy nhất |
| `userId` | String | FK → User, NULLABLE | Người thực hiện hành động |
| `action` | String | NOT NULL | Loại hành động (LOGIN, CREATE, UPDATE, DELETE) |
| `entity` | String | NOT NULL | Đối tượng bị tác động (ThietBi, BaoTri, v.v.) |
| `entityId` | String | NULLABLE | ID đối tượng bị tác động |
| `createdAt` | DateTime | AUTO | Thời điểm xảy ra sự kiện |

*(Hình 2.6: Sơ đồ ERD – chụp ảnh từ Prisma Studio hoặc vẽ từ file `docs/ERD.md`)*

---

## **3.3 Giao diện chương trình** {#giao-diện-chương-trình}

### **3.3.1 Giao diện trang đăng nhập** {#giao-diện-trang-đăng-nhập}

*(Hình 3.1: Giao diện trang đăng nhập)*

Trang đăng nhập tại route `/login` là điểm khởi đầu bắt buộc cho mọi người dùng. Giao diện gồm form với hai trường **Email** và **Mật khẩu**. Đối với tài khoản đã kích hoạt 2FA, sau khi xác minh đúng email/mật khẩu, hệ thống tự động hiện thêm trường nhập **Mã xác thực TOTP (6 chữ số)**. Thiết kế tối giản, responsive, sử dụng màu sắc chủ đạo của trường. Trang chuyển hướng tự động về `/dashboard` nếu người dùng đã có phiên đăng nhập hợp lệ.

### **3.3.2 Giao diện Dashboard tổng quan** {#giao-diện-dashboard-tổng-quan}

*(Hình 3.2: Giao diện Dashboard tổng quan)*

Dashboard tại route `/dashboard` cung cấp cái nhìn tổng thể ngay khi đăng nhập thành công. Giao diện bao gồm:

* **Thẻ thống kê (Summary Cards):** Hiển thị nhanh các chỉ số quan trọng: Tổng số thiết bị, số thiết bị Tốt, số thiết bị Hỏng, số thiết bị đang Bảo trì, tổng giá trị tài sản.
* **Thanh sidebar điều hướng (AppShell):** Danh sách các module chức năng được phân nhóm rõ ràng với icon lucide-react.
* **Topbar:** Hiển thị tên người dùng, khoa, vai trò và nút đăng xuất.

### **3.3.3 Giao diện quản lý thiết bị** {#giao-diện-quản-lý-thiết-bị}

*(Hình 3.3: Giao diện danh sách thiết bị)*

*(Hình 3.4: Giao diện form thêm/sửa thiết bị)*

Module quản lý thiết bị tại `/dashboard/thiet-bi` là module trung tâm của hệ thống. Giao diện gồm:

* **Bảng danh sách thiết bị (TanStack Table):** Hiển thị các cột Mã TB, Tên thiết bị, Danh mục, Trạng thái (badge màu), Khoa, Phòng, Giá trị, Ngày nhập. Hỗ trợ tìm kiếm, lọc theo trạng thái/danh mục/khoa và phân trang.
* **Nút thao tác:** Thêm mới, Sửa, Xóa (hiển thị/ẩn theo vai trò RBAC).
* **Import Excel:** Nút tải file Excel mẫu và upload để nhập hàng loạt thiết bị.
* **Form thêm/sửa:** Modal với đầy đủ trường thông tin, xác thực realtime bằng React Hook Form + Zod, dropdown chọn Danh mục, Nhà cung cấp, Khoa, Phòng.

### **3.3.4 Giao diện chi tiết thiết bị** {#giao-diện-chi-tiết-thiết-bị}

*(Hình 3.5: Giao diện chi tiết thiết bị và mã QR)*

Trang chi tiết thiết bị tại `/dashboard/thiet-bi/[id]` hiển thị:

* **Thông tin đầy đủ:** Tất cả thuộc tính của thiết bị, lịch sử thay đổi trạng thái.
* **Mã QR:** Được tạo tự động bằng thư viện `qrcode`, mã hóa URL trỏ đến trang chi tiết thiết bị. Người dùng có thể in hoặc tải về để dán lên thiết bị vật lý.
* **Tab lịch sử:** Lịch sử bảo trì (`BaoTri`) và lịch sử di chuyển địa điểm (`LichSuDiChuyen`) theo thứ tự thời gian.

### **3.3.5 Giao diện phiếu nhập kho** {#giao-diện-phiếu-nhập-kho}

*(Hình 3.6: Giao diện phiếu nhập kho)*

Module phiếu nhập tại `/dashboard/phieu-nhap` cho phép cán bộ tạo chứng từ nhập kho thiết bị mới. Giao diện hiển thị danh sách phiếu nhập với trạng thái (Chờ duyệt / Đã duyệt / Từ chối), thông tin nhà cung cấp, ngày lập phiếu và tổng giá trị. Chức năng tạo phiếu mới cho phép thêm nhiều dòng thiết bị vào một phiếu, tính tổng giá trị tự động.

### **3.3.6 Giao diện quản lý bảo trì** {#giao-diện-quản-lý-bảo-trì}

*(Hình 3.7: Giao diện quản lý bảo trì)*

Module bảo trì tại `/dashboard/bao-tri` quản lý toàn bộ vòng đời của yêu cầu bảo trì thiết bị. Giao diện gồm:

* **Danh sách phiếu bảo trì:** Hiển thị thiết bị cần bảo trì, loại bảo trì, kỹ thuật viên phụ trách, ngày bắt đầu, chi phí và trạng thái.
* **Form tạo phiếu bảo trì:** Chọn thiết bị, mô tả vấn đề, ước tính chi phí và thời gian.
* **Cập nhật kết quả:** Sau khi sửa chữa, cập nhật kết quả và chuyển trạng thái thiết bị về `TOT` hoặc `THANH_LY`.

### **3.3.7 Giao diện kiểm kê thiết bị** {#giao-diện-kiểm-kê-thiết-bị}

*(Hình 3.8: Giao diện kiểm kê thiết bị)*

Module kiểm kê tại `/dashboard/kiem-ke` hỗ trợ tổ chức các đợt kiểm kê định kỳ. Giao diện gồm:

* **Danh sách đợt kiểm kê:** Tên đợt, ngày bắt đầu, ngày kết thúc, người tạo, trạng thái.
* **Chi tiết đợt kiểm kê:** Danh sách thiết bị cần kiểm tra, cho phép xác nhận từng thiết bị với trạng thái thực tế, ghi chú sai lệch.
* **Tổng kết đợt:** Số thiết bị đã kiểm, số thiết bị chưa kiểm, số thiết bị có sai lệch.

### **3.3.8 Giao diện phân bổ và thanh lý** {#giao-diện-phân-bổ-và-thanh-lý}

*(Hình 3.9: Giao diện phân bổ thiết bị)*

*(Hình 3.10: Giao diện thanh lý thiết bị)*

**Phân bổ (`/dashboard/phan-bo`):** Hiển thị tổng quan phân bổ thiết bị theo khoa và phòng, kèm lịch sử di chuyển. Cho phép điều chuyển thiết bị giữa các phòng/khoa với ghi nhận lý do.

**Thanh lý (`/dashboard/thanh-ly`):** Danh sách thiết bị đang ở trạng thái `THANH_LY`, thông tin ngày thanh lý, lý do và giá trị còn lại. Hỗ trợ xuất báo cáo thanh lý.

### **3.3.9 Giao diện báo cáo tổng hợp** {#giao-diện-báo-cáo-tổng-hợp}

*(Hình 3.11: Giao diện báo cáo tổng hợp)*

Module báo cáo tại `/dashboard/bao-cao` (chỉ Admin và Trưởng khoa truy cập) cung cấp các thẻ tổng hợp:

* **Tổng giá trị tài sản:** Tổng `giaTriBanDau` của tất cả thiết bị đang hoạt động.
* **Thống kê theo trạng thái:** Số lượng thiết bị TOT/HONG/BAO_TRI/THANH_LY.
* **Thống kê theo khoa:** Phân bổ thiết bị và giá trị theo từng khoa/đơn vị.
* **Thống kê chi phí bảo trì:** Tổng chi phí bảo trì theo tháng/quý/năm.

Dữ liệu được lấy từ API `/api/bao-cao/summary` với các truy vấn Prisma Aggregation tổng hợp phía máy chủ.

### **3.3.10 Giao diện nhật ký hoạt động** {#giao-diện-nhật-ký-hoạt-động}

*(Hình 3.12: Giao diện nhật ký hoạt động)*

Module nhật ký tại `/dashboard/nhat-ky-hoat-dong` (chỉ Admin) hiển thị toàn bộ bảng `AuditLog` theo thứ tự thời gian mới nhất. Mỗi bản ghi gồm: Người thực hiện, Hành động (LOGIN/CREATE/UPDATE/DELETE), Đối tượng tác động, Thời điểm. Hỗ trợ lọc theo người dùng, loại hành động và khoảng thời gian.

### **3.3.11 Giao diện cài đặt tài khoản** {#giao-diện-cài-đặt-tài-khoản}

*(Hình 3.13: Giao diện cài đặt tài khoản)*

Trang cài đặt tại `/dashboard/cai-dat` cho phép người dùng:

* **Xem thông tin cá nhân:** Họ tên, email, khoa, vai trò hiện tại.
* **Đổi mật khẩu:** Form xác nhận mật khẩu cũ và nhập mật khẩu mới (tối thiểu 8 ký tự, có chữ hoa, số và ký tự đặc biệt), thực thi qua Server Action `changePassword()`.

---

# **KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN** {#kết-luận-và-hướng-phát-triển}

## **1. Kết luận** {#kết-luận}

Sau quá trình nghiên cứu, thiết kế và triển khai, đồ án tốt nghiệp **"Xây dựng hệ thống quản lý thiết bị ĐHSPKT"** đã đạt được các kết quả cụ thể sau:

**Về mặt kỹ thuật:**

* Xây dựng thành công ứng dụng web Full-stack hiện đại sử dụng kiến trúc **Next.js 16 App Router** kết hợp TypeScript, đảm bảo hiệu năng cao và trải nghiệm người dùng tốt.
* Thiết kế và triển khai cơ sở dữ liệu quan hệ **PostgreSQL** với **11 bảng nghiệp vụ** thông qua Prisma ORM, đảm bảo toàn vẹn dữ liệu và loại bỏ hoàn toàn nguy cơ SQL Injection.
* Cài đặt hệ thống bảo mật đa lớp: mã hóa mật khẩu bcrypt, phân quyền **RBAC** với 5 vai trò, xác thực phiên **JWT** và tích hợp **2FA TOTP** bảo vệ tài khoản quản trị.
* Triển khai ứng dụng dưới dạng **Progressive Web App (PWA)** hỗ trợ cài đặt trên thiết bị di động và truy cập offline.

**Về mặt nghiệp vụ, hệ thống đã hiện thực hóa đầy đủ:**

* Module **Quản lý thiết bị** với CRUD hoàn chỉnh, nhập hàng loạt từ Excel, tạo mã QR định danh vật lý.
* Module **Phiếu nhập kho** số hóa quy trình tiếp nhận tài sản.
* Module **Bảo trì** theo dõi toàn bộ lịch sử sửa chữa và chi phí.
* Module **Kiểm kê** tổ chức đợt kiểm kê định kỳ và đối chiếu số liệu.
* Module **Phân bổ và Thanh lý** quản lý điều chuyển và xử lý tài sản.
* Module **Báo cáo** cung cấp thống kê tổng hợp giá trị tài sản.
* Module **Nhật ký hoạt động** ghi nhận và kiểm toán toàn bộ thao tác trên hệ thống.

**Hạn chế còn tồn tại:**

* Dashboard tổng quan chưa kết nối trực tiếp với cơ sở dữ liệu để hiển thị số liệu thời gian thực.
* Chức năng mượn/trả thiết bị chưa được triển khai đầy đủ trong phiên bản hiện tại.
* Chức năng quên mật khẩu và gửi email thông báo chưa tích hợp backend thực tế.
* Giao diện quản lý tài khoản người dùng (Admin) đang trong quá trình phát triển.

## **2. Hướng phát triển** {#hướng-phát-triển}

Từ nền tảng đã xây dựng, hệ thống có thể được mở rộng theo các hướng sau:

* **Hoàn thiện module mượn/trả:** Xây dựng đầy đủ luồng mượn thiết bị từ phòng lab, theo dõi hạn trả, tính phí quá hạn và gửi nhắc nhở tự động qua email.
* **Tích hợp mã vạch và RFID:** Sử dụng máy quét mã vạch hoặc thẻ RFID để kiểm kê tài sản nhanh hơn, giảm sai sót so với kiểm kê thủ công.
* **Dashboard động theo dữ liệu thực:** Kết nối Dashboard tổng quan với cơ sở dữ liệu, bổ sung biểu đồ trực quan (Chart.js/Recharts) về xu hướng hỏng hóc, tần suất bảo trì theo thời gian.
* **Ứng dụng trí tuệ nhân tạo (AI):** Phân tích dữ liệu bảo trì lịch sử để dự đoán thiết bị có nguy cơ hỏng hóc, đề xuất lịch bảo trì phòng ngừa định kỳ.
* **Quản lý tài khoản người dùng:** Hoàn thiện giao diện Admin để thêm, sửa, vô hiệu hóa tài khoản, phân công khoa/vai trò trong giao diện đồ họa.
* **Thông báo realtime:** Tích hợp WebSocket hoặc Server-Sent Events để gửi cảnh báo tức thời khi thiết bị báo hỏng hoặc đến lịch bảo trì.
* **Xuất báo cáo PDF:** Hỗ trợ xuất phiếu nhập kho, báo cáo kiểm kê và thống kê tài sản ra file PDF chuẩn để lưu trữ và ký duyệt.

---

# **TÀI LIỆU THAM KHẢO** {#tài-liệu-tham-khảo}

**Tài liệu kỹ thuật chính thức:**

[1] Vercel, "Next.js Documentation – App Router," [Online]. Available: https://nextjs.org/docs. [Accessed: Jun. 2026].

[2] Prisma, "Prisma ORM Documentation," [Online]. Available: https://www.prisma.io/docs. [Accessed: Jun. 2026].

[3] Auth.js, "NextAuth.js v5 Documentation," [Online]. Available: https://authjs.dev. [Accessed: Jun. 2026].

[4] PostgreSQL Global Development Group, "PostgreSQL 16 Documentation," [Online]. Available: https://www.postgresql.org/docs/16/. [Accessed: Jun. 2026].

[5] Tailwind Labs, "Tailwind CSS v4 Documentation," [Online]. Available: https://tailwindcss.com/docs. [Accessed: Jun. 2026].

[6] Colby Fayock, "Zod Documentation," [Online]. Available: https://zod.dev. [Accessed: Jun. 2026].

[7] React Hook Form, "React Hook Form Documentation," [Online]. Available: https://react-hook-form.com. [Accessed: Jun. 2026].

[8] TanStack, "TanStack Table v8 Documentation," [Online]. Available: https://tanstack.com/table. [Accessed: Jun. 2026].

**Chuẩn và giao thức:**

[9] M. Jones, J. Bradley, N. Sakimura, "JSON Web Token (JWT) – RFC 7519," Internet Engineering Task Force (IETF), May 2015.

[10] D. M'Raihi, M. Bellare, F. Hoornaert, D. Naccache, O. Ranen, "TOTP: Time-Based One-Time Password Algorithm – RFC 6238," IETF, May 2011.

[11] S. Turner, "Bcrypt Password Hashing," NIST Special Publication 800-63B – Digital Identity Guidelines, 2017.

**Trang thông tin trường:**

[12] Trường Đại học Sư phạm Kỹ thuật – Đại học Đà Nẵng, "Trang chủ trường ĐHSPKT," [Online]. Available: https://ute.udn.vn. [Accessed: Jun. 2026].

[image1]: logo_dhspkt.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...>
