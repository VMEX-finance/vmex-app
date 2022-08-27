import React from 'react';

type IAssetDisplayProps = {
  logo: string;
  name: string;
  className?: string;
}

const AssetDisplay = (props: IAssetDisplayProps) => {
  return (
    <div className={`flex items-center gap-1 ${props.className ? props.className : ''}`}>
      <img src={props.logo} alt={props.name} height="30" width="30" />
      {props.name}
    </div>
  )
}

export { AssetDisplay }