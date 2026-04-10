import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LocationSelect.css';

const LocationSelect = ({ label, value, onChange }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/locations/provinces');
        setProvinces(res.data);
      } catch (error) {
        console.error('Lỗi tải Tỉnh/Thành', error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/locations/districts?provinceCode=${selectedProvince.code}`);
          setDistricts(res.data);
          setWards([]); 
          setSelectedDistrict('');
          setSelectedWard('');
        } catch (error) {
          console.error('Lỗi tải Quận/Huyện', error);
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedProvince]);

  // Fetch wards when district changes
  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/locations/wards?districtCode=${selectedDistrict.code}`);
          setWards(res.data);
          setSelectedWard('');
        } catch (error) {
          console.error('Lỗi tải Phường/Xã', error);
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  // Effect to construct the final string and call onChange
  useEffect(() => {
    if (selectedWard && selectedDistrict && selectedProvince) {
      const addressString = `${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`;
      onChange(addressString);
    } else if (selectedDistrict && selectedProvince) {
      const addressString = `${selectedDistrict.name}, ${selectedProvince.name}`;
      onChange(addressString);
    } else if (selectedProvince) {
      const addressString = `${selectedProvince.name}`;
      onChange(addressString);
    } else {
      onChange('');
    }
  }, [selectedProvince, selectedDistrict, selectedWard]);

  // Syncing clearing from parent
  useEffect(() => {
    if (!value) {
      setSelectedProvince('');
      setSelectedDistrict('');
      setSelectedWard('');
    }
  }, [value]);

  const handleProvinceChange = (e) => {
    const code = e.target.value;
    if (!code) {
      setSelectedProvince('');
      return;
    }
    const prov = provinces.find(p => p.code.toString() === code);
    setSelectedProvince(prov);
  };

  const handleDistrictChange = (e) => {
    const code = e.target.value;
    if (!code) {
      setSelectedDistrict('');
      return;
    }
    const dist = districts.find(d => d.code.toString() === code);
    setSelectedDistrict(dist);
  };

  const handleWardChange = (e) => {
    const code = e.target.value;
    if (!code) {
      setSelectedWard('');
      return;
    }
    const w = wards.find(w => w.code.toString() === code);
    setSelectedWard(w);
  };

  return (
    <div className="location-select-container">
      {label && <label className="location-label">{label}</label>}
      <div className="location-selectors">
        <select 
          className="location-select" 
          value={selectedProvince ? selectedProvince.code : ''} 
          onChange={handleProvinceChange}
        >
          <option value="">-- Chọn Tỉnh/Thành --</option>
          {provinces.map(p => (
            <option key={p.code} value={p.code}>{p.name}</option>
          ))}
        </select>

        <select 
          className="location-select" 
          value={selectedDistrict ? selectedDistrict.code : ''} 
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <option value="">-- Chọn Quận/Huyện --</option>
          {districts.map(d => (
            <option key={d.code} value={d.code}>{d.name}</option>
          ))}
        </select>

        <select 
          className="location-select" 
          value={selectedWard ? selectedWard.code : ''} 
          onChange={handleWardChange}
          disabled={!selectedDistrict}
        >
          <option value="">-- Chọn Phường/Xã --</option>
          {wards.map(w => (
            <option key={w.code} value={w.code}>{w.name}</option>
          ))}
        </select>
      </div>
      {value && <div className="location-preview">Kết quả: {value}</div>}
    </div>
  );
};

export default LocationSelect;
