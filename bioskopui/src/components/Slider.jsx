import React, { Component } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

class Slider extends Component {
  render() {
    return (
      <Carousel showThumbs={false} autoPlay infiniteLoop>
        <div>
          <img src="https://6a25bbd04bd33b8a843e-9626a8b6c7858057941524bfdad5f5b0.ssl.cf5.rackcdn.com/styles/movie_1500x580/rcf/news/A4_horz_brandburst_1500x580.jpg?itok=4MqI9imW" alt="Promotional banner for IMAX movies" />
          {/* <p className="legend"></p> */}
        </div>
        <div>
          <img src="https://www.geekgeneration.fr/wp-content/uploads/2019/02/Carre.Senart.IMAX_.HD_.044-%C2%A9-Fr%C3%A9d%C3%A9ric-Berthet.jpg" alt="IMAX cinema interior" />
          {/* <p className="legend"></p> */}
        </div>
        <div>
          <img src="https://cdn.celluloidjunkie.com/wp-content/uploads/2018/04/19172342/CinepolisOrlando-0010.jpg" alt="Cinema lobby with IMAX branding" />
          {/* <p className="legend"></p> */}
        </div>
      </Carousel>
    );
  }
}

export default Slider;
