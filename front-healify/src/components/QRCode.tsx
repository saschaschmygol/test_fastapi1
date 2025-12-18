import type { FC } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface Props {
  token: string;
}

const TokenQR: FC<Props> = ({ token }) => {
  return (
    <div>
      <QRCodeCanvas value={token} size={256} />
    </div>
  );
};

export default TokenQR;
