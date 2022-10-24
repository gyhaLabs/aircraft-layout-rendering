import React, { useCallback } from "react";
import { Stage, Layer, Text, Image, Rect } from "react-konva";
// import Konva from 'konva';
import { useState } from "react";
import useImages from "./useImages";
import useAircraftLayout from "./useAircraftLayout";

function App() {
  const {
    box,
    boxHovered,
    boxError,
    boxErrorHovered,
    background
  } = useImages();

  const { data: layoutData } = useAircraftLayout();

  const [stage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0
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
      y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

    // console.log("SCALE", newScale);

    setStage({
      scale: newScale,
      x: (stage.getPointerPosition().x / newScale - mousePointTo.x) * newScale,
      y: (stage.getPointerPosition().y / newScale - mousePointTo.y) * newScale
    });
  }, []);

  const [hoveredIds, setHoveredIds] = useState([]);

  return (
    <div className="App">
      <div
        style={{
          padding: 8,
          marginBottom: 20,
          background: "grey",
          color: "white"
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

        {layoutData.layers.map((layer) => {
          return (
            <Layer key={`seat-layer-${layer.id}`}>
              {layer.items.map((item) => {
                let image = hoveredIds.find((id) => id === item.id)
                  ? boxHovered
                  : box;

                if (item.hasError) {
                  image = hoveredIds.find((id) => id === item.id)
                    ? boxErrorHovered
                    : boxError;
                }
                return (
                  <React.Fragment key={`${layer.id}${item.id}`}>
                    <Image
                      x={item.posX}
                      y={item.posY}
                      width={item.width}
                      height={item.height}
                      image={image}
                      scaleX={1}
                      scaleY={1}
                      onClick={() => {
                        alert(`Clicked on ${item.text}`);
                      }}
                      onMouseEnter={() => {
                        setHoveredIds((prev) => [...prev, item.id]);
                      }}
                      onMouseLeave={() => {
                        setHoveredIds((prev) => {
                          const arrN = [...prev];
                          arrN.pop();
                          return [...arrN];
                        });
                      }}
                    />

                    <Text
                      text={item.text}
                      scaleX={stage.scale < 4 ? 0.8 : 0.2}
                      scaleY={stage.scale < 4 ? 0.8 : 0.2}
                      x={item.posX + 5}
                      y={item.posY + 5}
                    />
                  </React.Fragment>
                );
              })}
            </Layer>
          );
        })}
        {stage.scale > 4 && (
          <Layer key="device-layer">
            {layoutData.layers.map((layer) => {
              return layer.items.map((item) => {
                return item.items.map((deviceItem) => {
                  return (
                    <>
                      <Rect
                        x={deviceItem.posX}
                        y={deviceItem.posY}
                        width={deviceItem.width}
                        height={deviceItem.height}
                        scaleX={deviceItem.scale}
                        scaleY={deviceItem.scale}
                        fill={deviceItem.color}
                        shadowBlur={10}
                      />
                      <Text
                        text={deviceItem.text}
                        x={deviceItem.posX + deviceItem.width / 2 - 6}
                        y={deviceItem.posY + deviceItem.height / 2 - 4}
                        scaleX={deviceItem.scale}
                        scaleY={deviceItem.scale}
                      />
                    </>
                  );
                });
              });
            })}
          </Layer>
        )}
        {stage.scale > 80 && (
          <Layer key="software-layer">
            {layoutData.layers.map((layer) => {
              return layer.items.map((item) => {
                return item.items.map((deviceItem) => {
                  return (
                    <>
                      <Rect
                        x={deviceItem.posX + 0.2}
                        y={deviceItem.posY + 0.2}
                        width={deviceItem.width}
                        height={deviceItem.height}
                        scaleX={deviceItem.scale / 2}
                        scaleY={deviceItem.scale / 2}
                        fill="blue"
                        shadowBlur={10}
                      />
                      <Text
                        text="Software 1"
                        x={deviceItem.posX + 0.2}
                        y={deviceItem.posY + 0.2}
                        scaleX={deviceItem.scale / 12}
                        scaleY={deviceItem.scale / 12}
                      />
                    </>
                  );
                });
              });
            })}
          </Layer>
        )}
      </Stage>
    </div>
  );
}

export default App;
