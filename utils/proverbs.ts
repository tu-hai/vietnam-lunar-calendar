// Ca dao, ngạn ngữ Việt Nam
export const vietnameseProverbs = [
  "Có công mài sắt, có ngày nên kim.",
  "Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.",
  "Ăn quả nhớ kẻ trồng cây.",
  "Uống nước nhớ nguồn.",
  "Đói cho sạch, rách cho thơm.",
  "Chớ thấy sóng cả mà ngã tay chèo.",
  "Học thầy không tày học bạn.",
  "Không thầy đố mày làm nên.",
  "Tất cả vì dân thân yêu, tất cả vì hạnh phúc và tự do của dân.",
  "Chớ khinh tấc nước, non cao.",
  "Lá lành đùm lá rách.",
  "Xa mặt cách lòng.",
  "Một giọt máu đào hơn ao nước lã.",
  "Thương người như thể thương thân.",
  "Tốt gỗ hơn tốt nước sơn.",
  "Ở hiền gặp lành.",
  "Chậm mà chắc.",
  "Ăn theo thuở, ở theo thì.",
  "Cha mẹ sinh con, trời sinh tính.",
  "Công cha như núi Thái Sơn, nghĩa mẹ như nước trong nguồn chảy ra.",
  "Cái khó ló cái khôn.",
  "Giọt máu đào hơn ao nước lã.",
  "Học ăn, học nói, học gói, học mở.",
  "Trăm hay không bằng tay quen.",
  "Thân tàn, ma không giám.",
  "Cần cù bù thông minh.",
  "Có chí thì nên.",
  "Ăn mừng nhai dầm.",
  "Lời nói chẳng mất tiền mua, lựa lời mà nói cho vừa lòng nhau.",
  "Gần mực thì đen, gần đèn thì sáng.",
  "Cái nết đánh chết cái đẹp.",
  "Đánh kẻ chạy đi, không ai đánh kẻ chạy lại.",
  "Dục tốc bất đạt.",
  "Ăn người một miếng, trả người một mâm.",
  "Học, học nữa, học mãi.",
  "Mạnh ai nấy sống, yếu ai nấy chết.",
  "Một con ngựa đau, cả tàu bỏ cỏ.",
  "Của người ta chẳng phải của ta, một mảy không rừng một mảy chăng.",
  "Nhất nghệ tinh, nhất thân vinh.",
  "Thất bại là mẹ thành công.",
  "Cái khó bó cái khôn.",
  "Không có gì quý hơn độc lập, tự do.",
  "Bán anh em xa, mua láng giềng gần.",
  "Đứng núi này trông núi nọ.",
  "Ăn cháo đá bát.",
  "Nhân nào quả nấy.",
  "Việc gì khó, có ta đây.",
  "Uống nước nhớ nguồn, ăn quả nhớ người trồng cây.",
  "Ăn mày cũng cần có cái túi.",
  "Học từ nôi đến già.",
];

// Hàm lấy ca dao ngẫu nhiên dựa trên ngày
export function getProverbForDate(day: number, month: number, year: number): string {
  // Sử dụng ngày để tạo index ổn định cho mỗi ngày
  const seed = day + month * 31 + year * 372;
  const index = seed % vietnameseProverbs.length;
  return vietnameseProverbs[index];
}

// Hàm lấy ca dao ngẫu nhiên hoàn toàn
export function getRandomProverb(): string {
  const index = Math.floor(Math.random() * vietnameseProverbs.length);
  return vietnameseProverbs[index];
}
