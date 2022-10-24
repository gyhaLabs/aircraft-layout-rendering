import React, { useCallback } from 'react';
import { Stage, Layer, Image } from 'react-konva';
import { useState } from 'react';
import useImages from './useImages';
import useAircraftLayout from './useAircraftLayout';
import SoftwareLayer from './Layers/SoftwareLayer';
import DeviceLayer from './Layers/DeviceLayer';
import SeatLayer from './Layers/SeatLayer';

function App() {
    const { background } = useImages();

    const { data: layoutData } = useAircraftLayout();

    const [stage, setStage] = useState({
        scale: 1,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
    });

    const handleMouseMove = useCallback((e) => {
        e.evt.preventDefault();
        // const stage = e.target.getStage();
        // console.log(stage.getPointerPosition().x, stage.getPointerPosition().y);
    }, []);

    const handleWheel = useCallback((e) => {
        e.evt.preventDefault();

        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

        const stageToSet = {
            scale: newScale,
            x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
            y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale,
            width: stage.width(),
            height: stage.height(),
        };

        setStage(stageToSet);
    }, []);

    const [hoveredIds, setHoveredIds] = useState([]);

    if (layoutData.empty) {
        return null;
    }

    return (
        <div className="App">
            <div
                style={{
                    padding: 8,
                    marginBottom: 20,
                    background: 'grey',
                    color: 'white',
                }}
            >
                Aircraft layout rendering solution demo based on canvas
            </div>
            <Stage
                draggable
                width={window.innerWidth}
                height={window.innerHeight - 50}
                onWheel={handleWheel}
                onMouseMove={handleMouseMove}
                scaleX={stage.scale}
                scaleY={stage.scale}
                x={stage.x}
                y={stage.y}
            >
                <Layer>
                    <Image x={0} y={0} image={background} scaleX={0.5} scaleY={0.5} />
                </Layer>

                {layoutData.layers.map((layer, i) => (
                    <SeatLayer layer={layer} hoveredIds={hoveredIds} setHoveredIds={setHoveredIds} stage={stage} key={`layer-${i}`} />
                ))}
                {stage.scale > 4 && <DeviceLayer layoutData={layoutData} stage={stage} />}
                {stage.scale > 80 && <SoftwareLayer layoutData={layoutData} stage={stage} />}
            </Stage>
        </div>
    );
}

export default App;
