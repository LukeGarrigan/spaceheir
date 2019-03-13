export default function(x, y, space){
  let parallaxEffect = 20;
  for (let i = 0; i < 3; i++) {
    image(space[i], -(x / parallaxEffect), -(y / parallaxEffect));
    image(space[i], space[i].width - (x / parallaxEffect), -(y / parallaxEffect));
    image(space[i], space[i].width * 2 - (x / parallaxEffect), -(y / parallaxEffect));

    image(space[i], -(x / parallaxEffect), space[i].height - (y / parallaxEffect));
    image(space[i], space[i].width - (x / parallaxEffect), space[i].height - (y / parallaxEffect));
    image(space[i], space[i].width * 2 - (x / parallaxEffect), space[i].height - (y / parallaxEffect));

    image(space[i], -(x / parallaxEffect), space[i].height * 2 - (y / parallaxEffect));
    image(space[i], space[i].width - (x / parallaxEffect), space[i].height * 2 - (y / parallaxEffect));
    image(space[i], space[i].width * 2 - (x / parallaxEffect), space[i].height * 2 - (y / parallaxEffect));
    parallaxEffect += 5;
  }
}