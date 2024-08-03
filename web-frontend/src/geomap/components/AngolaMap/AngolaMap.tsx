/* eslint-disable @typescript-eslint/no-explicit-any */
import useCoffeeDataAngola, { IMapProvincy } from '../../hooks/useCoffeeDataAngola';

import './AngolaMap.scss';
import {
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useAuth } from '@/context/AuthContext';
import Tooltip from '../Tooltip/Tooltip';

export default function AngolaMap() {

  const tooltip = useRef<HTMLDivElement>(null);
  const [tooltipContent, setTooltipContent] = useState<ReactNode>(null);
  const [mapProvincies, setMapProvincies] = useState<IMapProvincy[]>([]);
  const { mapData, partiesData } = useAuth();

  const width = 400;
  const height = 400;

  const {
    constructProvincies,
    isMatchCoffeeRegion,
    getRegionColor,
    getRegionHoverColor,
  } = useCoffeeDataAngola();
  
  const mapSize: [number, number] = useMemo(() => {
    return [
      (width) || 0,
      (height) || 0
    ];
  }, [height, width])

  const handleMouseOverCountry = (evt: React.MouseEvent<SVGPathElement, MouseEvent>, provincy: IMapProvincy) => {
    if (tooltip?.current) {
      tooltip.current.style.display = "block";
      tooltip.current.style.left = evt.pageX + 10 + 'px';
      tooltip.current.style.top = evt.pageY + 10 + 'px';
      setTooltipContent(renderTooltipContent(provincy));
    }

    setMapProvincies(mapProvincies
      .map(m => {
        if (isMatchCoffeeRegion(m, provincy)) {
          return {
            ...m,
            svg: {
              ...m.svg,
              stroke: getRegionHoverColor(),
              fill: getRegionHoverColor(),
            }
          }
        }

        return m;
      }));
  };

  const handleMouseLeaveCountry = () => {
    if (tooltip?.current) {
      tooltip.current.style.display = "none";
    }

    setMapProvincies(mapProvincies
      .map(m => {
          return {
            ...m,
            svg: {
              ...m.svg,
              stroke: getRegionColor(),
              fill: getRegionColor(),
            }
          }
      }));
  };

  const renderTooltipContent = (provincy: IMapProvincy): ReactNode => {

    return (
      <div className="WorldMap--tooltip">
        <div className="WorldMap--tooltip--title">
          {provincy.Nome_Prov_}
        </div>
        <hr />
        <div className='p-3'>
          <div className="WorldMap--tooltip--content">
            <ul>

              {partiesData && partiesData.map((e: string, index: number) => {
                if (mapData[provincy.Nome_Prov_] !== undefined && mapData[provincy.Nome_Prov_][e] !== undefined) {
                  return (
                    <li key={index}>{e + ': '}{mapData[provincy.Nome_Prov_][e]}</li>
                  );
                }
                return null;
              })}

              {mapData[provincy.Nome_Prov_] && mapData[provincy.Nome_Prov_]['sum'] !== undefined && (
                <span key={100}>
                  Total # of votes: {mapData[provincy.Nome_Prov_]['sum']}
                </span>
              )}

            </ul>
          </div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const initialmapProvincies = constructProvincies(mapSize);
    setMapProvincies(initialmapProvincies);
  }, [constructProvincies, mapSize]);

  return (
    <div className="AngolaMap">

      <div ref={tooltip} style={{ position: 'absolute', display: 'none' }}>
        <Tooltip>
          {tooltipContent}
        </Tooltip>
      </div>

      <svg
        className="AngolaMap--svg"
        width={mapSize[0]}
        height={mapSize[1]}
        stroke='black'
      >
        {mapProvincies && mapProvincies.map(provincy => {
          return (
            <path
              id={provincy.OBJECTID.toString()}
              key={provincy.Nome_Prov_}
              {...provincy.svg}
              onMouseMove={(e) => handleMouseOverCountry(e, provincy)}
              onMouseLeave={() => handleMouseLeaveCountry()}
              stroke='white'
              strokeWidth={0.5}
            />
          )
        })}
      </svg>
    </div>
  );
}