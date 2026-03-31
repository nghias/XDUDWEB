import React from 'react';
import { MapPin, Home, Maximize } from 'lucide-react'; // Dùng thư viện giống Admin

const RoomCard = ({ room }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
      {/* Ảnh đại diện từ bảng post_images [cite: 13] */}
      <div className="relative h-48 w-full bg-gray-200">
        <img 
          src={room.image_url || "https://via.placeholder.com/400x300"} 
          alt={room.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
          {room.room_type}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 truncate">{room.title}</h3>
        
        {/* Địa chỉ từ bảng locations [cite: 11] */}
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin size={14} className="mr-1" />
          <span>{room.district}, {room.city_province}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          {/* Giá từ bảng posts  */}
          <span className="text-red-500 font-bold text-xl">
            {room.price.toLocaleString()} <span className="text-sm font-normal text-gray-500">/tháng</span>
          </span>
          {/* Diện tích từ bảng posts  */}
          <div className="flex items-center text-gray-600 text-sm">
            <Maximize size={14} className="mr-1" />
            <span>{room.area}m²</span>
          </div>
        </div>

        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors">
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default RoomCard;