"use client";
import { useEffect, useState } from 'react';

const brands = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/2560px-Nintendo.svg.png',
  'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg',
  'https://blogs.microsoft.com/wp-content/uploads/prod/2012/08/8867.Microsoft_5F00_Logo_2D00_for_2D00_screen.jpg',
  'https://1000logos.net/wp-content/uploads/2019/05/Electronic-Arts-logo.png',
  'https://i.pinimg.com/originals/7a/e4/14/7ae4149e02025e44b52237faa251dab3.png',
  'https://www.havit.ma/wp-content/uploads/2021/09/logo-havit-2.png',
  'https://logowik.com/content/uploads/images/redragon102.logowik.com.webp'
];

export default function BrandSlider() {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => (prevPosition + 1) % (brands.length * 2));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden w-full bg-white m-5 ">
      <div
        className="flex transition-transform duration-1000 ease-in-out justify-center items-center mix-blend-multiply"
        style={{
          transform: `translateX(-${position * (50 / (brands.length * 2))}%)`,
          width: `${brands.length * 30}%`,
        }}
      >
        {brands.map((brand, index) => (
          <div key={index} className="w-1/5 px-10">
            <img src={brand} alt="Brand logo" className="block mx-auto" width={150} height={75} style={{ objectFit: 'contain' }} />
          </div>
        ))}
        {brands.map((brand, index) => (
          <div key={index + brands.length} className="w-1/5 px-10">
            <img src={brand} alt="Brand logo" className="block mx-auto" width={150} height={75} style={{ objectFit: 'contain' }} />
          </div>
        ))}
      </div>
    </div>
  );
}
