export default function(x, y, space){
  
  // let parallaxEffect = 20;
  // for (let i = 0; i < 1; i++) {
  //   image(space[0][i], -(x / parallaxEffect), -(y / parallaxEffect));
  //   image(space[0][i], space[0][i].width - (x / parallaxEffect), -(y / parallaxEffect));
  //   image(space[0][i], space[0][i].width * 2 - (x / parallaxEffect), -(y / parallaxEffect));
  //
  //   image(space[0][i], -(x / parallaxEffect), space[0][i].height - (y / parallaxEffect));
  //   image(space[0][i], space[0][i].width - (x / parallaxEffect), space[0][i].height - (y / parallaxEffect));
  //   image(space[0][i], space[0][i].width * 2 - (x / parallaxEffect), space[0][i].height - (y / parallaxEffect));
  //
  //   image(space[0][i], -(x / parallaxEffect), space[0][i].height * 2 - (y / parallaxEffect));
  //   image(space[0][i], space[0][i].width - (x / parallaxEffect), space[0][i].height * 2 - (y / parallaxEffect));
  //   image(space[0][i], space[0][i].width * 2 - (x / parallaxEffect), space[0][i].height * 2 - (y / parallaxEffect));
  //   parallaxEffect += 5;
  // }
  
  const EFFECT = 10;

  image(space[0], -(x / EFFECT), -(y / EFFECT));
  image(space[0], space[0].width - (x / EFFECT), -(y / EFFECT));
  image(space[0], space[0].width * 2 - (x / EFFECT), -(y / EFFECT));

  image(space[0], -(x / EFFECT), space[0].height - (y / EFFECT));
  image(space[0], space[0].width - (x / EFFECT), space[0].height - (y / EFFECT));
  image(space[0], space[0].width * 2 - (x / EFFECT), space[0].height - (y / EFFECT));


  image(space[0], -(x / EFFECT), space[0].height * 2 - (y / EFFECT));
  image(space[0], space[0].width - (x / EFFECT), space[0].height * 2 - (y / EFFECT));
  image(space[0], space[0].width * 2 - (x / EFFECT), space[0].height * 2 - (y / EFFECT));
}