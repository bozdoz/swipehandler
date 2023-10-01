import SwipeHandler from "../src/index";
import { userEvent } from "@testing-library/user-event";

it.skip("works with defaults", async () => {
  const swipe = jest.fn();
  const sw = new SwipeHandler();

  sw.onSwipe(swipe);

  // TODO: no idea how to get this working
  await userEvent.pointer(
    [
      {
        keys: "[TouchA>]",
        coords: { x: 50, y: 50 },
        target: document.body,
      },
      {
        pointerName: "TouchA",
        coords: { x: 50, y: 40 },
        target: document.body,
      },
      {
        pointerName: "TouchA",
        coords: { x: 50, y: 30 },
        target: document.body,
      },
      {
        pointerName: "TouchA",
        coords: { x: 50, y: 20 },
        target: document.body,
      },
      {
        pointerName: "TouchA",
        coords: { x: 50, y: 10 },
        target: document.body,
      },
      { keys: "[/TouchA]" },
    ],
    {
      delay: 25,
    },
  );

  expect(swipe).toHaveBeenCalled();
});
