export default function(x, y, space){

  image(space, -(x / 10), -(y / 10));
  image(space, space.width - (x / 10), -(y / 10));
  image(space, space.width * 2 - (x / 10), -(y / 10));

  // second Hlayer
  image(space, -(x / 10), space.height - (y / 10));
  image(space, space.width - (x / 10), space.height - (y / 10));
  image(space, space.width * 2 - (x / 10), space.height - (y / 10));

  // third HLayer
  image(space, -(x / 10), space.height * 2 - (y / 10));
  image(space, space.width - (x / 10), space.height * 2 - (y / 10));
  image(space, space.width * 2 - (x / 10), space.height * 2 - (y / 10));

}