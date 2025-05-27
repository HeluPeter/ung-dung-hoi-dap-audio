import React, { useState, useRef, useEffect } from 'react';

// --- Biểu tượng SVG (Giữ nguyên) ---
const MicIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 14a2 2 0 0 1-2-2V6a2 2 0 0 1 4 0v6a2 2 0 0 1-2 2zm0-10a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V8a4 4 0 0 0-4-4z" /><path d="M17 12a1 1 0 0 0-1 1v1.42A5.992 5.992 0 0 1 12 19a5.992 5.992 0 0 1-4-1.58V13a1 1 0 0 0-2 0v.42A7.99 7.99 0 0 0 11 21v2a1 1 0 0 0 2 0v-2a7.99 7.99 0 0 0 5-7.58V13a1 1 0 0 0-1-1z" /></svg>
);
const StopIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z" /></svg>
);
const PlayIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
);
const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const XCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const ChevronLeftIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
);
const ChevronRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
);
const RefreshIcon = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
);
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
);
// --- Kết thúc Biểu tượng SVG ---

// --- CSS Animations ---
const CustomStyles = () => (
  <style>{`
    @keyframes pop-in {
      0% { transform: scale(0.95); opacity: 0.6; }
      50% { transform: scale(1.02); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-pop-in { animation: pop-in 0.4s ease-out; }

    @keyframes shake-horizontal {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
      20%, 40%, 60%, 80% { transform: translateX(3px); }
    }
    .animate-shake-horizontal { animation: shake-horizontal 0.5s ease-in-out; }

    @keyframes gentle-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(251, 113, 133, 0.5); } /* rose-400 */
      50% { box-shadow: 0 0 0 8px rgba(251, 113, 133, 0); }
    }
    .animate-gentle-pulse { animation: gentle-pulse 1.5s infinite; }
  `}</style>
);
// --- Kết thúc CSS Animations ---


// --- Danh sách câu hỏi mẫu ---
const initialSampleQuestions = [
  {
    id: 1,
    questionText: "1. H. Phụng vụ là gì?",
    correctAnswerText: "Thưa. Phụng vụ là việc Hội Thánh chính thức cử hành mầu nhiệm Đức Kitô, để thờ phượng Thiên Chúa và thánh hóa con người.",
  },
  {
    id: 2,
    questionText: "2. H. Phụng vụ có vị trí nào trong Hội Thánh?",
    correctAnswerText: "Thưa. Phụng vụ là chóp đỉnh và là nguồn mạch các hoạt động của Hội Thánh, qua đó Đức Kitô tiếp tục công trình cứu độ của Ngài.",
  },
  {
    id: 3,
    questionText: "3. H. Đức Kitô tiếp tục công trình cứu độ của Ngài trong Hội Thánh thế nào?",
    correctAnswerText: "Thưa. Đức Kitô tiếp tục công trình cứu độ của Ngài trong Hội Thánh qua các bí tích được gọi là nhiệm cục bí tích.",
  },
  {
    id: 4,
    questionText: "4. H. Nhiệm cục bí tích là gì?",
    correctAnswerText: "Thưa. Nhiệm cục bí tích là sự chuyển thông ơn cứu độ của Chúa qua việc Hội Thánh cử hành các bí tích, nhất là bí tích Thánh Thể.",
  },
  {
    id: 5,
    questionText: "5. H. Ai hành động trong phụng vụ?",
    correctAnswerText: "Thưa. Chính “Đức Kitô toàn thể”, nghĩa là Đức Kitô cùng với Thân Thể của Ngài là Hội Thánh trên trời và Hội Thánh ở trần gian hành động trong phụng vụ.",
  },
  {
    id: 6,
    questionText: "6. H. Cử hành phụng vụ gồm những yếu tố nào?",
    correctAnswerText: "Thưa. Cử hành phụng vụ gồm hai yếu tố này: - Một là các dấu chỉ và biểu tượng, để diễn tả và thực hiện hành động cứu độ của Đức Kitô; - Hai là lời nói và hành động, nhờ đó con người gặp gỡ và đối thoại với Thiên Chúa.",
  },
  {
    id: 7,
    questionText: "7. H. Ngày Chúa Nhật quan trọng thế nào trong Năm phụng vụ?",
    correctAnswerText: "Thưa. Ngày Chúa Nhật rất quan trọng vì là “Ngày của Chúa”, ngày Chúa Phục Sinh. Vì thế, ngày Chúa Nhật là nền tảng và trung tâm của cả Năm Phụng vụ.",
  },
  {
    id: 8,
    questionText: "8. H. Năm phụng vụ là gì?",
    correctAnswerText: "Thưa. Năm Phụng vụ là thời gian Hội Thánh cử hành các mầu nhiệm Đức Kitô, để giúp chúng ta sống những mầu nhiệm ấy, hầu chuẩn bị đón Ngài lại đến trong vinh quang.",
  },
  {
    id: 9,
    questionText: "9. H. Phụng vụ Các Giờ Kinh là gì?",
    correctAnswerText: "Thưa. Phụng vụ Các Giờ Kinh là lời cầu nguyện của Đức Kitô cùng với Hội Thánh, để giúp các tín hữu thánh hóa thời gian trong ngày.",
  },
  {
    id: 10,
    questionText: "10. H. Bí tích là gì?",
    correctAnswerText: "Thưa. Bí tích là dấu chỉ bên ngoài Chúa Giê-su đã lập và truyền lại cho Hội Thánh cử hành, để diễn tả và thông ban cho chúng ta ân sủng bên trong là sự sống thần linh.",
  },
  {
    id: 11,
    questionText: "11. H. Có mấy bí tích?",
    correctAnswerText: "Thưa. Có 7 bí tích: - Một là Bí tích Rửa Tội; - Hai là Bí tích Thêm Sức; - Ba là Bí tích Thánh Thể; - Bốn là Bí tích Thống Hối; - Năm là Bí tích Xức Dầu Bệnh Nhân; - Sáu là Bí tích Truyền Chức Thánh; - Bảy là Bí tích Hôn Phối."
  },
  {
    id: 12,
    questionText: "12. H. Các bí tích của Hội Thánh được phân loại thế nào?",
    correctAnswerText: "Thưa. Các bí tích của Hội Thánh được phân thành ba loại này: - Một là các bí tích khai tâm Kitô giáo; - Hai là các bí tích chữa lành; - Ba là các bí tích phục vụ."
  },
  {
    id: 13,
    questionText: "13. H. Các bí tích khai tâm Kitô Giáo gồm những bí tích nào?",
    correctAnswerText: "Thưa. Các bí tích khai tâm Kitô giáo gồm Bí tích Rửa Tội, Thêm Sức và Thánh Thể. Các bí tích này tái sinh, củng cố và nuôi dưỡng các tín hữu trong đời sống mới."
  },
  {
    id: 14,
    questionText: "14. H. Các bí tích chữa lành gồm những bí tích nào?",
    correctAnswerText: "Thưa. Các bí tích chữa lành gồm Bí tích Thống Hối và Xức Dầu Bệnh Nhân. Các bí tích này phục hồi và củng cố đời sống mới của các tín hữu đã bị suy yếu hoặc mất đi do tội lỗi."
  },
  {
    id: 15,
    questionText: "15. H. Các bí tích phục vụ gồm những bí tích nào?",
    correctAnswerText: "Thưa. Các bí tích phục vụ gồm Bí tích Truyền Chức Thánh và Hôn Phối. Hai bí tích này đem lại ân sủng riêng cho mỗi sứ vụ đặc biệt trong Hội Thánh, để xây dựng Dân Thiên Chúa."
  },
  {
    id: 16,
    questionText: "16. H. Ấn tín bí tích là gì?",
    correctAnswerText: "Thưa. Ấn tín bí tích là dấu ấn thiêng liêng, Thiên Chúa in vào lòng những người lãnh Bí tích Rửa Tội, Thêm Sức, Truyền Chức Thánh, như lời hứa và bảo đảm cho sự che chở của Ngài. Vì ấn tín không thể xóa được, nên các bí tích này chỉ được lãnh một lần mà thôi."
  },
  {
    id: 17,
    questionText: "17. H. Vì sao gọi là bí tích đức tin?",
    correctAnswerText: "Thưa. Vì khi lãnh nhận bí tích, chúng ta phải có đức tin, đồng thời nhờ các bí tích, đức tin của chúng ta thêm mạnh mẽ vững vàng."
  },
  {
    id: 18,
    questionText: "18. H. Ai ban ân sủng trong các bí tích?",
    correctAnswerText: "Thưa. Chính Đức Kitô hoạt động và thông ban ân sủng trong các bí tích, nhưng ân sủng này có mang lại lợi ích hay không thì còn tùy thuộc vào sự chuẩn bị nội tâm của người lãnh nhận."
  },
  {
    id: 19,
    questionText: "19. H. Vì sao các bí tích cần thiết cho ơn cứu độ?",
    correctAnswerText: "Thưa. Vì các bí tích trao ban ân sủng của Chúa Thánh Thần, để Ngài chữa lành và biến đổi chúng ta."
  },
  {
    id: 20,
    questionText: "20. H. Các bí tích giúp chúng ta sống đời sống vĩnh cửu thế nào?",
    correctAnswerText: "Thưa. Các bí tích cho chúng ta tham dự trước vào đời sống vĩnh cửu, đang khi mong chờ ngày Đức Kitô ngự đến trong vinh quang."
  },
  {
    id: 21,
    questionText: "21. H. Bí Tích Rửa Tội là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để làm cho chúng ta được sinh lại trong đời sống mới bởi nước và Thánh Thần."
  },
  {
    id: 22,
    questionText: "22. H. Nghi thức chính yếu của Bí Tích Rửa Tội là gì?",
    correctAnswerText: "Thưa. Nghi thức chính yếu của Bí Tích Rửa Tội là dìm xuống nước hay đổ nước trên đầu người lãnh bí tích và nói: “Tôi rửa anh, nhân danh Cha và Con và Thánh Thần.”"
  },
  {
    id: 23,
    questionText: "23. H. Bí Tích Rửa Tội có cần thiết cho ơn cứu độ không?",
    correctAnswerText: "Thưa. Bí Tích Rửa Tội cần thiết cho ơn cứu độ, đối với những ai đã nghe rao giảng Tin Mừng và có khả năng xin lãnh nhận bí tích này."
  },
  {
    id: 24,
    questionText: "24. H. Người không lãnh nhận Bí Tích Rửa Tội có được cứu độ không?",
    correctAnswerText: "Thưa. Người không lãnh Bí Tích Rửa Tội có thể được cứu độ trong ba trường hợp này: - Một là chết vì đức tin; - Hai là có lòng ước ao nhưng chưa có điều kiện lãnh nhận Bí Tích Rửa Tội; - Ba là chưa được biết Chúa Kitô và Hội Thánh, nhưng đã theo tiếng lương tâm mà sống ngay lành."
  },
  {
    id: 25,
    questionText: "25. H. Bí Tích Rửa Tội ban cho chúng ta những ơn nào?",
    correctAnswerText: "Thưa. Bí Tích Rửa Tội ban cho chúng ta những ơn này: - Một là được tha tội tổ tông và các tội riêng đã phạm; - Hai là được làm con cái Thiên Chúa; - Ba là được tháp nhập vào Đức Kitô và Hội Thánh; - Bốn là được ghi vào linh hồn dấu ấn thiêng liêng không bao giờ xóa được."
  },
  {
    id: 26,
    questionText: "26. H. Bí Tích Thêm Sức là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để ban tràn đầy Chúa Thánh Thần, hầu giúp chúng ta sống ơn Bí Tích Rửa Tội cách mạnh mẽ và tốt đẹp hơn."
  },
  {
    id: 27,
    questionText: "27. H. Nghi thức chính yếu của Bí Tích Thêm Sức là gì?",
    correctAnswerText: "Thưa. Là việc xức dầu thánh trên trán người đã lãnh Bí Tích Rửa Tội, cùng với việc đặt tay trên đầu người ấy và đọc rằng “Hãy lãnh nhận ấn tín ơn Chúa Thánh Thần.”"
  },
  {
    id: 28,
    questionText: "28. H. Hiệu quả của Bí Tích Thêm Sức là gì?",
    correctAnswerText: "Thưa. Là việc đổ tràn Chúa Thánh Thần trên người lãnh bí tích, nhờ đó họ được ghi ấn tín không thể tẩy xóa và gia tăng ân sủng Bí Tích Rửa Tội."
  },
  {
    id: 29,
    questionText: "29. H. Người muốn lãnh nhận Bí Tích Thêm Sức cần phải làm gì?",
    correctAnswerText: "Thưa. Người lãnh Bí Tích Thêm Sức phải làm những điều này: - Một là phải sạch tội trọng; - Hai là phải học giáo lý, nhất là về Bí Tích Thêm Sức; - Ba là phải cầu nguyện sốt sắng và thật lòng ước ao lãnh nhận Chúa Thánh Thần."
  },
  {
    id: 30,
    questionText: "30. H. Người lãnh Bí Tích Thêm Sức có những bổn phận nào?",
    correctAnswerText: "Thưa. Người lãnh Bí Tích Thêm Sức có những bổn phận này: - Một là nỗ lực thi hành Lời Chúa trong đời sống thường ngày; - Hai là góp phần xây dựng xã hội theo tinh thần Tin Mừng; - Ba là tích cực giới thiệu Chúa cho mọi người."
  },
  {
    id: 31,
    questionText: "31. H. Bí Tích Thánh Thể là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để tiếp tục lễ hy sinh trên Thánh giá và để ban Mình Máu Ngài, làm của ăn nuôi sống chúng ta."
  },
  {
    id: 32,
    questionText: "32. H. Chúa Giê-su đã lập Bí Tích Thánh Thể thế nào?",
    correctAnswerText: "Thưa. Khi tự nguyện nộp mình chịu khổ hình, Chúa Giê-su cầm lấy bánh, tạ ơn, bẻ ra và trao cho các môn đệ mà nói: “Tất cả các con hãy nhận lấy mà ăn: vì này là mình Thầy, sẽ bị nộp vì các con”. Cùng một thể thức ấy, sau bữa ăn tối, Người cầm lấy chén rượu, cũng tạ ơn, trao cho các môn đệ mà nói: “Tất cả các con hãy nhận lấy mà uống: vì này là chén máu Thầy, máu Giao ước mới và vĩnh cửu, sẽ đổ ra cho các con và nhiều người được tha tội: Các con hãy làm việc này mà nhớ đến Thầy.”"
  },
  {
    id: 33,
    questionText: "33. H. Bí Tích Thánh Thể có ý nghĩa gì trong đời sống Kitô giáo?",
    correctAnswerText: "Thưa. Bí Tích Thánh Thể là nguồn mạch và tột đỉnh của toàn bộ đời sống Kitô giáo, chứa đựng tất cả kho tàng thiêng liêng của Hội Thánh là chính Đức Kitô, Chiên Vượt Qua của chúng ta."
  },
  {
    id: 34,
    questionText: "34. H. Hội Thánh cử hành Bí Tích Thánh Thể thế nào?",
    correctAnswerText: "Thưa. Hội Thánh cử hành Bí Tích Thánh Thể trong Thánh lễ, gồm hai phần chính: - Một là Phụng vụ Lời Chúa, khởi đi từ lời nguyện nhập lễ cho đến hết lời nguyện chung; - Hai là Phụng vụ Thánh Thể, khởi đi từ việc chuẩn bị lễ vật cho đến hết lời nguyện hiệp lễ."
  },
  {
    id: 35,
    questionText: "35. H. Hội Thánh dạy thế nào về việc rước lễ?",
    correctAnswerText: "Thưa. Hội Thánh khuyên các tín hữu rước lễ mỗi khi tham dự Thánh lễ, và buộc rước lễ một năm ít là một lần trong mùa Phục Sinh."
  },
  {
    id: 36,
    questionText: "36. H. Phải có điều kiện nào để được rước lễ?",
    correctAnswerText: "Thưa. Phải có những điều kiện này: - Một là hoàn toàn thuộc về Hội Thánh Công Giáo; - Hai là ý thức mình không có tội trọng; - Ba là phải giữ chay theo quy định của Hội Thánh; - Bốn là có thái độ tôn kính Đức Kitô."
  },
  {
    id: 37,
    questionText: "37. H. Việc rước lễ đem lại cho chúng ta những ơn ích nào?",
    correctAnswerText: "Thưa. Việc rước lễ làm cho chúng ta được kết hợp mật thiết với Đức Kitô và Hội Thánh, được tẩy xóa các tội nhẹ, gia tăng ân sủng và lòng yêu mến tha nhân."
  },
  {
    id: 38,
    questionText: "38. H. Bí Tích Thống Hối là gì?",
    correctAnswerText: "Thưa. Là bí tích Chúa Giê-su đã lập, để tha các tội riêng chúng ta đã phạm từ khi lãnh Bí Tích Rửa Tội về sau, cùng giao hòa chúng ta với Thiên Chúa và Hội Thánh."
  },
  {
    id: 39,
    questionText: "39. H. Chúa Giê-su đã lập Bí Tích Thống Hối khi nào?",
    correctAnswerText: "Thưa. Chúa Giê-su đã lập Bí Tích Thống Hối khi Ngài hiện ra với các Tông đồ vào chiều ngày Phục Sinh và nói rằng: “Anh em hãy nhận lấy Thánh Thần; anh em tha tội cho ai, thì tội người ấy được tha; anh em cầm giữ ai, thì tội người ấy bị cầm giữ.”"
  },
  {
    id: 40,
    questionText: "40. H. Bí Tích Thống Hối có những yếu tố chính yếu nào?",
    correctAnswerText: "Thưa. Bí Tích Thống Hối có hai yếu tố chính yếu này: - Một là hành vi của người sám hối; - Hai là lời xá giải của linh mục."
  },
  {
    id: 41,
    questionText: "41. H. Muốn lãnh nhận Bí Tích Thống Hối chúng ta phải làm gì?",
    correctAnswerText: "Thưa. Muốn lãnh Bí Tích Thống Hối chúng ta phải làm bốn việc này: - Một là xét mình; - Hai là ăn năn và dốc lòng chừa; - Ba là xưng tội; - Bốn là đền tội."
  },
  {
    id: 42,
    questionText: "42. H. Khi nào các tín hữu buộc phải xưng các tội trọng?",
    correctAnswerText: "Thưa. Khi đến tuổi khôn, mọi tín hữu buộc phải xưng các tội trọng của mình ít nhất một năm một lần và trong mọi trường hợp, phải xưng các tội trọng trước khi rước lễ."
  },
  {
    id: 43,
    questionText: "43. H. Bí Tích Thống Hối có những hiệu quả nào?",
    correctAnswerText: "Thưa. Bí Tích Thống Hối có những hiệu quả này: - Một là tha tội để giao hòa chúng ta với Thiên Chúa và Hội Thánh; - Hai là tha hình phạt muôn đời do các tội trọng đã gây ra và tha một phần các hình phạt tạm; - Ba là ban sự bình an và gia tăng sức mạnh cho cuộc chiến đấu thiêng liêng của người Kitô hữu."
  },
  {
    id: 44,
    questionText: "44. H. Ân xá là gì?",
    correctAnswerText: "Thưa. Ân xá là việc tha thứ những hình phạt tạm đáng chịu vì những tội chúng ta đã phạm, dù những tội này đã được tha thứ."
  }
];

// --- Kết thúc Danh sách câu hỏi mẫu ---

function App() {
  const [questions] = useState(initialSampleQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState(''); // 'correct' or 'incorrect' for animation
  const [isLoadingSTT, setIsLoadingSTT] = useState(false);
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const feedbackKey = useRef(0); // For re-triggering animation

  const GEMINI_API_KEY = "AIzaSyBZmgaQnBt199xHZGU5aPs08nlTEycXew4";

  const currentQuestion = questions.length > 0 ? questions[currentQuestionIndex] : null;

  useEffect(() => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setTranscript('');
    setFeedbackMessage('');
    setFeedbackType('');
    feedbackKey.current += 1; // Change key to allow re-animation
    setError('');
    setIsRecording(false);
    setIsLoadingSTT(false);
    setIsLoadingExplanation(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [audioUrl]);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (err) {
      setError("Không thể truy cập microphone. Vui lòng cấp quyền và thử lại.");
      return null;
    }
  };

  const startRecording = async () => {
    setError('');
    setFeedbackMessage('');
    setFeedbackType('');
    feedbackKey.current += 1;
    setTranscript('');
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);

    const stream = await requestMicrophonePermission();
    if (!stream) return;

    setIsRecording(true);
    audioChunksRef.current = [];
    const options = { mimeType: 'audio/webm;codecs=opus' };
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = 'audio/ogg;codecs=opus';
        if (!MediaRecorder.isTypeSupported(options.mimeType)) options.mimeType = '';
    }
    mediaRecorderRef.current = new MediaRecorder(stream, options);
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
      setAudioBlob(blob);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      stream.getTracks().forEach(track => track.stop());
    };
    mediaRecorderRef.current.start();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const normalizeText = (text) => {
    return text
      .replace(/“|”|"/g,'') // Loại bỏ dấu nháy
      .replace(/-/g,'') // Loại bỏ dấu gạch nối
      .replace(/[.,;|/?\\!@#$%^&*()_+=~`'{}\[\]:<>]/g,'') // Loại bỏ dấu chấm, phẩy và các ký tự đặc biệt
      .replace(/\s+/g,' ') // Thay thế nhiều khoảng trắng bằng một khoảng trắng
      .trim() // Cắt bỏ khoảng trắng thừa
      .toLowerCase(); // Chuyển đổi thành chữ thường
  };

  const handleCheckAnswer = async () => {
    feedbackKey.current += 1; // New key for animation
    if (!audioBlob) {
      setError("Vui lòng ghi âm câu trả lời trước.");
      return;
    }
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_API_KEY_HERE") {
        setError("Lỗi: API Key của Gemini chưa được cấu hình.");
        return;
    }

    setIsLoadingSTT(true);
    setError('');
    setFeedbackMessage('');
    setFeedbackType('');
    setTranscript('');
    setIsLoadingExplanation(false);

    try {
      const base64Audio = await blobToBase64(audioBlob);
      const audioMimeType = audioBlob.type || 'audio/webm';
      const payloadSTT = { contents: [{role: "user", parts: [{ text: "Hãy chuyển giọng nói trong đoạn âm thanh này thành văn bản tiếng Việt một cách chính xác nhất có thể. Văn bản trả về chỉ nên chứa nội dung được nói, không thêm bất kỳ lời dẫn hay giải thích nào khác." },{ inlineData: { mimeType: audioMimeType, data: base64Audio }}]}]};
      const apiUrlSTT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
      const responseSTT = await fetch(apiUrlSTT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payloadSTT)});

      if (!responseSTT.ok) { const errorData = await responseSTT.json(); throw new Error(`Lỗi API STT: ${errorData.error?.message || responseSTT.statusText}`);}
      const resultSTT = await responseSTT.json();
      const transcribed = resultSTT.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!transcribed) {
        setTranscript('');
        setFeedbackMessage("Không thể nhận dạng giọng nói. Vui lòng thử lại.");
        setFeedbackType('incorrect');
        setIsLoadingSTT(false);
        return;
      }
      setTranscript(transcribed);
      setIsLoadingSTT(false);

      const normalizedTranscribed = normalizeText(transcribed);
      const normalizedCorrectAnswer = normalizeText(currentQuestion.correctAnswerText);

      if (normalizedTranscribed === normalizedCorrectAnswer) {
        setFeedbackMessage("Chính xác! Tuyệt vời!");
        setFeedbackType('correct');
      } else {
        setFeedbackType('incorrect');
        setIsLoadingExplanation(true);
        const detailedFeedback = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Hãy thử lại nhé!`;
        const initialIncorrectMsg = `Sai rùi hehe ^^.\n${detailedFeedback}`;;
        setFeedbackMessage(initialIncorrectMsg );

        // const explanationPrompt = `Câu hỏi là: "${currentQuestion.questionText}". Đáp án đúng của câu hỏi này là: "${currentQuestion.correctAnswerText}". Học sinh đã trả lời là: "${transcribed}". Hãy đưa ra một lời giải thích ngắn gọn (tối đa 2-3 câu), thân thiện, dễ hiểu bằng tiếng Việt cho học sinh, chỉ ra điểm chưa đúng trong câu trả lời của học sinh hoặc gợi ý về đáp án đúng. Bắt đầu bằng một cách xưng hô thân mật như "Bạn ơi," hoặc "Này bạn,".`;
        // const explanationPayload = { contents: [{ role: "user", parts: [{ text: explanationPrompt }] }]};
        // const apiUrlExplanation = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        // try {
        //     const explanationResponse = await fetch(apiUrlExplanation, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(explanationPayload)});
        //     if (!explanationResponse.ok) { const errorData = await explanationResponse.json(); throw new Error(`Lỗi API giải thích: ${errorData.error?.message || explanationResponse.statusText}`);}
        //     const explanationResult = await explanationResponse.json();
        //     let detailedFeedback = explanationResult.candidates?.[0]?.content?.parts?.[0]?.text;
        //     if (!detailedFeedback) detailedFeedback = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Hãy cố gắng hơn nhé!`;
        //     setFeedbackMessage(`${initialIncorrectMsg}\n${detailedFeedback}`);
        // } catch (explanationError) {
        //     const fallbackMsg = `Đáp án đúng là: "${currentQuestion.correctAnswerText}". Lần sau cố gắng hơn nhé!`;
        //     setFeedbackMessage(`${initialIncorrectMsg}\n${fallbackMsg}`);
        // } finally {
            setIsLoadingExplanation(false);
        // }
      }
    } catch (err) {
      setError(`Đã xảy ra lỗi: ${err.message}. Vui lòng thử lại.`);
      setIsLoadingSTT(false);
      setIsLoadingExplanation(false);
    }
  };

  const handlePreviousQuestion = () => { if (questions.length > 0) setCurrentQuestionIndex((prev) => (prev - 1 + questions.length) % questions.length);};
  const handleNextQuestion = () => { if (questions.length > 0) setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);};
  const handleRandomQuestion = () => { if (questions.length > 0) setCurrentQuestionIndex(Math.floor(Math.random() * questions.length));};

  const isCurrentlyBusy = isLoadingSTT || isLoadingExplanation || isRecording;

  return (
    <>
      <CustomStyles />
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-fuchsia-100 to-sky-100 flex flex-col items-center p-4 font-sans text-slate-700">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-2xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-purple-600">AI Kiểm Tra Giáo Lý</h1>
          
          <div className="mb-6 text-center">
            <button
              onClick={handleRandomQuestion}
              disabled={isCurrentlyBusy}
              className="flex items-center justify-center mx-auto bg-violet-400 hover:bg-violet-500 disabled:bg-slate-200 disabled:text-slate-400 text-violet-900 font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150"
            >
              <RefreshIcon className="w-5 h-5 mr-2" />
              Câu hỏi Ngẫu nhiên
            </button>
          </div>

          {currentQuestion ? (
            <>
              <div className="mb-6 p-5 bg-white rounded-xl shadow-lg">
                <p className="text-sm md:text-base font-semibold mb-1.5 text-purple-500">
                  Câu hỏi {currentQuestionIndex + 1}/{questions.length}
                </p>
                <p className="text-xl md:text-2xl text-slate-800">{currentQuestion.questionText}</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3 mb-6">
                {!isRecording ? (
                  <button onClick={startRecording} disabled={isCurrentlyBusy}
                    className="flex items-center justify-center w-full sm:w-auto bg-emerald-400 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-emerald-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
                    <MicIcon className="w-6 h-6 mr-2" /> Bắt đầu Ghi âm
                  </button>
                ) : (
                  <button onClick={stopRecording} disabled={isLoadingSTT || isLoadingExplanation}
                    className={`flex items-center justify-center w-full sm:w-auto bg-rose-500 hover:bg-rose-600 disabled:bg-slate-200 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 animate-gentle-pulse`}
                  >
                    <StopIcon className="w-6 h-6 mr-2" /> Dừng Ghi âm
                  </button>
                )}
                <button onClick={handleCheckAnswer} disabled={!audioBlob || isCurrentlyBusy}
                  className="flex items-center justify-center w-full sm:w-auto bg-sky-400 hover:bg-sky-500 disabled:bg-slate-200 disabled:text-slate-400 text-sky-900 font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
                  {(isLoadingSTT || isLoadingExplanation) ? <Spinner className="text-sky-800"/> : <PlayIcon className="w-6 h-6 mr-2" />}
                  {isLoadingSTT ? 'Đang nhận dạng...' : (isLoadingExplanation ? 'AI Phân tích...' : 'Kiểm tra Đáp án')}
                </button>
              </div>
              
              {audioUrl && !isRecording && (
                  <div className="my-5 text-center">
                      <p className="text-sm mb-1.5 text-slate-600">Nghe lại câu trả lời của bạn:</p>
                      <audio controls src={audioUrl} className="mx-auto rounded-lg shadow-md w-full max-w-xs"></audio>
                  </div>
              )}

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg text-center"><p>{error}</p></div>
              )}
              {transcript && feedbackMessage && ( // Chỉ hiển thị khi chưa có feedback cuối cùng
                <div className="mt-4 p-4 bg-slate-50 rounded-lg shadow">
                  <p className="font-semibold text-purple-500">Câu trả lời của bạn: </p>
                  <p className="italic text-slate-700">"{transcript}"</p>
                </div>
              )}
              {feedbackMessage && (
                <div 
                  key={feedbackKey.current} // Key để trigger animation khi message thay đổi
                  className={`mt-5 p-4 rounded-xl shadow-lg text-left font-semibold text-lg whitespace-pre-line transition-all duration-300
                  ${feedbackType === 'correct' ? 'bg-green-100 text-green-800 border border-green-300 animate-pop-in' 
                    : (feedbackType === 'incorrect' ? 'bg-red-100 text-red-800 border border-red-300 animate-shake-horizontal' : 'bg-slate-100 text-slate-700 border border-slate-300')}`}
                >
                  <div className="flex items-start">
                      {feedbackType === 'correct' ? 
                      <CheckCircleIcon className="w-7 h-7 mr-3 flex-shrink-0 mt-1 text-green-600"/> : 
                      (feedbackType === 'incorrect' ? <XCircleIcon className="w-7 h-7 mr-3 flex-shrink-0 mt-1 text-red-600"/> : null)
                      }
                      <p>{feedbackMessage}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center">
                <button onClick={handlePreviousQuestion} disabled={isCurrentlyBusy || questions.length <= 1}
                  className="flex items-center bg-slate-300 hover:bg-slate-400 disabled:bg-slate-100 disabled:text-slate-400 text-slate-800 font-semibold py-2.5 px-5 rounded-lg shadow hover:shadow-md transition-all duration-150">
                  <ChevronLeftIcon className="w-5 h-5 mr-1.5" /> Câu trước
                </button>
                <button onClick={handleNextQuestion} disabled={isCurrentlyBusy || questions.length <= 1}
                  className="flex items-center bg-slate-300 hover:bg-slate-400 disabled:bg-slate-100 disabled:text-slate-400 text-slate-800 font-semibold py-2.5 px-5 rounded-lg shadow hover:shadow-md transition-all duration-150">
                  Câu tiếp <ChevronRightIcon className="w-5 h-5 ml-1.5" />
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-xl py-10 text-slate-600">Không có câu hỏi nào để hiển thị.</p>
          )}
           <footer className="mt-10 pt-6 border-t border-slate-300/70 text-center text-xs text-slate-500">
              <p>Nhấn vào nút Ghi âm để ghi âm câu trả lời và sau đó nhấn Kiểm tra xem đúng chưa nhé!</p>
              <p className="font-semibold mt-2 text-purple-600">Lưu ý: Nếu có lỗi gì sai gì inbox ngay cho Oppa nha, kamsahe ~~</p>
          </footer>
        </div>
      </div>
    </>
  );
}
export default App;