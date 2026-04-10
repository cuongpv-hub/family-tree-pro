const axios = require('axios');
const Province = require('../models/Province');
const District = require('../models/District');
const Ward = require('../models/Ward');

async function seedLocations() {
  try {
    // Chỉ seed nếu DB chưa có Province nào
    const count = await Province.count();
    if (count > 0) {
      console.log('[📍] Dữ liệu Đại dư địa chí (Tỉnh/Thành) đã tồn tại. Bỏ qua cào dữ liệu.');
      return;
    }

    console.log('[⏳] Bắt đầu quá trình đồng bộ toàn bộ địa giới hành chính Việt Nam...');
    const response = await axios.get('https://provinces.open-api.vn/api/?depth=3');
    const data = response.data;
    
    // Thu thập thành mảng dẹt (flat array) để Bulk Create cực nhanh thay vì lặp qua từng cái
    const provincesToInsert = [];
    const districtsToInsert = [];
    const wardsToInsert = [];

    for (const p of data) {
      provincesToInsert.push({ code: p.code, name: p.name });
      if (p.districts) {
        for (const d of p.districts) {
          districtsToInsert.push({ code: d.code, name: d.name, provinceCode: p.code });
          if (d.wards) {
            for (const w of d.wards) {
              wardsToInsert.push({ code: w.code, name: w.name, districtCode: d.code });
            }
          }
        }
      }
    }

    console.log(`[🚀] Tiến hành ép ${provincesToInsert.length} Tỉnh, ${districtsToInsert.length} Huyện, ${wardsToInsert.length} Xã vào CSDL Thể Rắn...`);
    
    // Bulk create 
    await Province.bulkCreate(provincesToInsert);
    await District.bulkCreate(districtsToInsert);
    // SQLite bulk insert with huge transactions can fail if array is too big, so chunk it if > 5000 is needed, 
    // but wardsToInsert has ~10,000 items. Let's insert in chunks of 2000.
    const chunkSize = 2000;
    for (let i = 0; i < wardsToInsert.length; i += chunkSize) {
      const chunk = wardsToInsert.slice(i, i + chunkSize);
      await Ward.bulkCreate(chunk);
    }
    
    console.log('[✅] Hoàn tất kiến tạo Sa Bàn Trái Đất (Việt Nam) thành công!');
  } catch (error) {
    console.error('Lỗi khi cào dữ liệu địa giới:', error.message);
  }
}

module.exports = seedLocations;
