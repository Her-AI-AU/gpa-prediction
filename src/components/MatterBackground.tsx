"use client";
import Matter from "matter-js";
import { useRef, useEffect, useState } from "react";

interface MatterBackgroundProps {
  circleCount?: number;
  fillPercentage?: number;
}

export function MatterBackground({ circleCount = 100, fillPercentage = 0.5 }: MatterBackgroundProps) {
  const matterContainer = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (
      !matterContainer.current ||
      windowSize.width === 0 ||
      windowSize.height === 0
    )
      return;

    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
    } = Matter;

    const containerWidth = windowSize.width;
    const containerHeight = windowSize.height;

    const THINCCESS = 20;
    const CIRCLE_COUNT = circleCount;

    // Calculate radius based on fill percentage
    const totalArea = containerWidth * containerHeight;
    const totalCircleArea = totalArea * fillPercentage;
    const singleCircleArea = totalCircleArea / CIRCLE_COUNT;
    const radius = Math.sqrt(singleCircleArea / Math.PI);

    // Set min and max radius
    const MAX_RADIUS = radius * 1.4;
    const MIN_RADIUS = radius * 0.6;

    matterContainer.current.innerHTML = "";

    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: matterContainer.current,
      engine: engine,
      options: {
        width: containerWidth,
        height: containerHeight,
        wireframes: false,
        background: "transparent",
      },
    });
    renderRef.current = render;

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    const circles: Matter.Body[] = [];

    for (let i = 0; i < CIRCLE_COUNT; i++) {
      const circleRadius = MIN_RADIUS + Math.random() * (MAX_RADIUS - MIN_RADIUS);
      var circle = Bodies.circle(
        Math.random() * containerWidth,
        Math.random() * containerHeight,
        circleRadius,
        {
          friction: 0.3,
          restitution: 0.6,
          render: {
            fillStyle: `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`,
          },
        }
      );
      circles.push(circle);
      Composite.add(engine.world, circle);
    }

    const ground = Bodies.rectangle(
      containerWidth / 2,
      containerHeight + THINCCESS / 2,
      containerWidth,
      THINCCESS,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    const leftWall = Bodies.rectangle(
      0 - THINCCESS / 2,
      containerHeight / 2,
      THINCCESS,
      containerHeight * 25,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    const rightWall = Bodies.rectangle(
      containerWidth + THINCCESS / 2,
      containerHeight / 2,
      THINCCESS,
      containerHeight * 25,
      { isStatic: true, render: { fillStyle: "transparent" } }
    );

    Composite.add(engine.world, [ground, leftWall, rightWall]);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    return () => {
      Render.stop(render);
      Runner.stop(runner);
      Engine.clear(engine);
      if (render.canvas) {
        render.canvas.remove();
      }
      render.context = null as any;
      render.textures = {};
      if (mouse) {
        Mouse.clearSourceEvents(mouse);
      }
    };
  }, [windowSize, circleCount, fillPercentage]);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-500 to-purple-500">
      <div ref={matterContainer} className="w-full h-full" />
    </div>
  );
}
