

export default function paintMap(ctx, anomalies, transports, enemies, bounties, mapSize, anomalyImg, transportImg, coinImg, enemyImg) {
      // console.log(anomalies)
      

      anomalies.forEach(anomaly => {
            const { radius, x, y, strength, id, effectiveRadius } = anomaly;
            // console.log(anomaly)

            ctx.drawImage(anomalyImg, x - radius * 1.2, y - radius * 1.2, radius * 2.4, radius * 2.4); // Рисуем изображение размером 40x40 пикселей

            // ctx.beginPath();
            // ctx.strokeStyle = 'red'
            // ctx.arc(x, y, radius, 0, 2 * Math.PI);
            // ctx.lineWidth = 4;
            // ctx.stroke();

            ctx.beginPath();
            ctx.arc(x, y, effectiveRadius, 0, 2 * Math.PI);
            ctx.lineWidth = 4;
            
            ctx.fillStyle = `rgb(255, 255, 255, 0.${strength / 2})`;
            ctx.strokeStyle = 'black'
            ctx.fill();
            ctx.stroke();
      });

      enemies.forEach(enemy => {
            ctx.fillStyle = 'red';
            const { x, y, health, killBounty  } = enemy;
            
            ctx.drawImage(enemyImg, x - 20, y - 30, 40, 60); // Рисуем изображение размером 40x40 пикселей

            ctx.fillStyle = health >= 50 ? 'green' : 'red';
            ctx.font = '16px Arial';
            ctx.fillText(`Health: ${health}`, x - 40, y + 46);
            ctx.fillText(`KillBounty: ${killBounty}`, x - 50, y + 64);
      });

      transports.forEach(transport => {
            const { x, y, health, deathCount } = transport;
            // console.log(transport)

            ctx.drawImage(transportImg, x - 20, y - 30, 40, 60); // Рисуем изображение размером 40x40 пикселей

            ctx.beginPath();
            ctx.fillStyle = health >= 50 ? 'green' : 'red';
            ctx.font = '16px Arial';
            ctx.fillText(`Health: ${health}`, x - 40, y + 46);
            ctx.fillText(`DeathCount: ${deathCount}`, x - 50, y + 64);
      });

      // Пример отрисовки наград
      bounties.forEach(bounty => {
            const { x, y } = bounty;

            ctx.drawImage(coinImg, x - 10, y - 10, 20, 20); // Рисуем изображение размером 40x40 пикселей
      });

      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, mapSize.x, mapSize.y)
}