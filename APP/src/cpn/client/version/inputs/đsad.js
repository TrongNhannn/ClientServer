import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default (props) => {
  // ... (các hooks và hàm khác)

  const isFieldVarchar = () => {
    return field.field_type === "varchar";
  };

  if (isFieldVarchar()) {
    return (
      <div className="w-100-pct p-1 m-t-1">
        <div>
          <div>
            <span className="block text-16-px">
              {field.field_name}
              {!field.nullable && (
                <span style={{ color: 'red' }}> *</span>
              )}
            </span>
          </div>
          <div className="m-t-0-5">
            <input
              type="text"
              className="p-t-0-5 p-b-0-5 p-l-1 text-16-px block w-100-pct border-1"
              placeholder=""
              onChange={fieldChangeData}
              value={current}
            />

            {varcharError && (
              <span className="block p-t-0-5 text-red text-14-px">
                Vượt quá số lượng kí tự
              </span>
            )}
          </div>
        </div>
      </div>
    );
  } else if (isFieldForeign()) {
    return (
      // Thành phần input cho trường có khóa ngoại
    );
  } else {
    return (
      // Thành phần input cho các trường khác
    );
  }
};
