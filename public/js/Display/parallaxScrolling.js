export default function(x, y, space){

  let parallaxEffect = 10;
  let imageIndex = 0;
  image(space[imageIndex], -(x / parallaxEffect), -(y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), -(y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), -(y / parallaxEffect));

  image(space[imageIndex], -(x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));

  image(space[imageIndex], -(x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));

  parallaxEffect = 15;
  imageIndex = 1;
  image(space[imageIndex], -(x / parallaxEffect), -(y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), -(y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), -(y / parallaxEffect));

  image(space[imageIndex], -(x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));

  image(space[imageIndex], -(x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));

  parallaxEffect = 20;
  imageIndex = 2;
  image(space[imageIndex], -(x / parallaxEffect), -(y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), -(y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), -(y / parallaxEffect));

  image(space[imageIndex], -(x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), space[imageIndex].height - (y / parallaxEffect));

  image(space[imageIndex], -(x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width - (x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));
  image(space[imageIndex], space[imageIndex].width * 2 - (x / parallaxEffect), space[imageIndex].height * 2 - (y / parallaxEffect));
}