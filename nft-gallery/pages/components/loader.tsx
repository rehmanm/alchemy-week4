import * as React from 'react';

export interface ILoaderProps {
  loading: boolean
}

export function Loader(props: ILoaderProps) {
  return (
    <div>
      {props.loading && (
        <div className="spinner">
          <div className="loader"></div>
        </div>
      )}
    </div>
  )
}
