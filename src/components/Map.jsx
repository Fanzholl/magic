import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './SCSS/Map.scss';
import paintMap from './mechanics/paintMap.js';
import Stats from './ui/Stats.jsx';

import backgroundImageSrc from '../img/01_desert_day.jpg';
import transportImage from '../img/cover.webp';
import anomalyImage from '../img/anomalyB.png';
import coinImage from '../img/coin.png';
import enemyImage from '../img/enemy.png';


function Map() {
      const mapRef = useRef(null);

      const [mapData, setMapData] = useState(null);
      const [scale, setScale] = useState(0.1); // Добавляем состояние для масштаба
      const [dragging, setDragging] = useState(false);
      const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
      const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

      const transportImg = new Image();
      transportImg.src = transportImage;

      const anomalyImg = new Image();
      anomalyImg.src = anomalyImage;

      const coinImg = new Image();
      coinImg.src = coinImage;

      const enemyImg = new Image();
      enemyImg.src = enemyImage;

      useEffect(() => {
            const canvas = mapRef.current;
            const ctx = canvas.getContext('2d');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mapRef.current.width = canvas.width;
            mapRef.current.height = canvas.height;

            ctx.translate(canvas.width / 2, canvas.height / 2);

            mapRef.current.ctx = ctx;

            // Загрузка фонового изображения
            const backgroundImage = new Image();
            backgroundImage.src = backgroundImageSrc; // Укажите путь к вашему изображению
            backgroundImage.onload = () => {
                  ctx.drawImage(backgroundImage, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
            };
      }, []);

      useEffect(() => {
            const wss = new WebSocket('ws://localhost:1488');
    
            wss.onopen = () => {
                console.log('WebSocket connection established');
                // Отправка данных на сервер при установлении соединения
            //     wss.send();
            };
    
            wss.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (!data.message) setMapData(data);
            //     console.log(data)
                
            };
    
            wss.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
    
            wss.onclose = () => {
                console.log('WebSocket connection closed');
            };
    
            return () => {
                  wss.close();
            };
        }, []);

      // Обновление canvas при изменении данных
      useEffect(() => {
            if (mapData && mapRef.current && mapRef.current.ctx) {
                  const ctx = mapRef.current.ctx;

                  // Очистка canvas перед новой отрисовкой
                  // ctx.clearRect(-mapRef.current.width, -mapRef.current.height, mapRef.current.width * 2, mapRef.current.height * 2);

                  // Загрузка фонового изображения
                  const backgroundImage = new Image();
                  backgroundImage.src = backgroundImageSrc; // Укажите путь к вашему изображению
                  backgroundImage.onload = () => {
                        // console.log(2);
                        ctx.drawImage(backgroundImage, -mapRef.current.width / 2, -mapRef.current.height / 2, mapRef.current.width, mapRef.current.height);

                        ctx.save();
                        ctx.scale(scale, scale);
                        ctx.translate(dragOffset.x, dragOffset.y);

                        paintMap(ctx, mapData.anomalies, mapData.transports, mapData.enemies, mapData.bounties, mapData.mapSize, anomalyImg, transportImg, coinImg, enemyImg);

                        ctx.restore();
                  };
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [mapData, scale, dragOffset]);

      // useEffect(() => {
      //       const interval = setInterval(() => {
      //             // updatePositions()
      //       }, 1000);
      // }, []);

      // const updatePositions = () => {
      //       setMapData(prevData => ({
      //           ...prevData,
      //           transports: prevData.transports.map((transport) => ({
      //               ...transport,
      //               x: transport.x + 1,
      //               y: transport.y + transport.velocity.y
      //           })),
      //           enemies: prevData.enemies.map((enemy) => ({
      //               ...enemy,
      //               x: enemy.x + enemy.velocity.x,
      //               y: enemy.y + enemy.velocity.y
      //           }))
      //       }));
      //   };

      const handleWheel = (event) => {
            const zoomFactor = 0.1;
            if (event.deltaY < 0) {
                  setScale(prevScale => Math.min(prevScale + zoomFactor, 5)); // Увеличение масштаба
            } else {
                  setScale(prevScale => Math.max(prevScale - zoomFactor, 0.1)); // Уменьшение масштаба
            }
      };

      const handleMouseDown = (event) => {
            setDragging(true);
            setDragStart({ x: event.clientX, y: event.clientY });
      };

      const handleMouseMove = (event) => {
            if (dragging) {
                  const offsetX = event.clientX - dragStart.x;
                  const offsetY = event.clientY - dragStart.y;
                  setDragOffset(prevOffset => ({
                        x: prevOffset.x + offsetX / scale,
                        y: prevOffset.y + offsetY / scale
                  }));
                  setDragStart({ x: event.clientX, y: event.clientY });
            }
      };

      const handleMouseUp = () => {
            setDragging(false);
      };

      return (
            <div
                  className="Map"
                  onWheel={handleWheel}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
            >
                  <Stats />
                  <canvas ref={mapRef} id='map'></canvas>
            </div>
      );
}

export default Map;