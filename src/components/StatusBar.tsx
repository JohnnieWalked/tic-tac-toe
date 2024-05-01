'use client';

import { DetailedHTMLProps, HTMLAttributes, useEffect, useState } from 'react';
import { socket } from '@/socket';

function StatusBar(
  props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
) {
  const [isConnected, setIsConnected] = useState<boolean>();
  const [transport, setTransport] = useState('N/A');

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }
    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      socket.io.engine.on('upgrade', (transport) => {
        setTransport(transport.name);
      });
    }
    function onDisconnect() {
      setIsConnected(false);
      setTransport('N/A');
    }
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return (
    <div {...props}>
      Status:{' '}
      <span
        className={` font-light ${
          isConnected ? 'text-green-600' : 'text-red-700'
        }`}
      >
        {isConnected ? 'connected' : 'disconnected'}
      </span>
    </div>
  );
}

export default StatusBar;
