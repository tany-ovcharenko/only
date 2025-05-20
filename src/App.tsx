import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper as SwiperClass } from 'swiper';
import 'swiper/swiper-bundle.css';
import './App.css';
import gsap from 'gsap';

interface AnimatedNumberProps {
  number: number;
  animationKey: string;
  color: string;
}

const AnimatedNumber = ({ number, animationKey, color }: AnimatedNumberProps) => {
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const animationDuration = 500;
    const frameDuration = 10;
    const totalFrames = animationDuration / frameDuration;
    let currentFrame = 0;

    const animate = () => {
      currentFrame++;
      const progress = currentFrame / totalFrames;
      const easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      setDisplayNumber(Math.round(number * easedProgress));

      if (currentFrame >= totalFrames) {
        clearInterval(intervalId);
        setDisplayNumber(number);
      }
    };

    setDisplayNumber(0);
    currentFrame = 0;
    intervalId = setInterval(animate, frameDuration);

    return () => clearInterval(intervalId);
  }, [number, animationKey]);

  return <span style={{ color: color }}>{displayNumber}</span>;
};

interface SlideData {
  startYear: number;
  endYear: number;
  category: string;
  description: string;
}

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const slides: SlideData[] = [
    { startYear: 1992, endYear: 1997, category: 'Литература', description: '' },
    { startYear: 1999, endYear: 2004, category: 'Балет', description: '' },
    { startYear: 1988, endYear: 1992, category: 'Кино', description: '' },
    { startYear: 1987, endYear: 1991, category: 'Кино', description: '' },
    { startYear: 2010, endYear: 2015, category: 'Технологии', description: '' },
    { startYear: 2015, endYear: 2022, category: 'Наука', description: '' },
  ];

    useEffect(() => {
    gsap.to(circleRef.current, {
      duration: 0.5,
      rotation: currentSlideIndex * -360 / slides.length,
      ease: "power2.easeInOut",
    });

    gsap.to(indicatorRef.current, {
      duration: 0.5,
      rotation: currentSlideIndex * 360 / slides.length,  // Rotate the indicator
      ease: "power2.easeInOut",
    });
  }, [currentSlideIndex, slides.length]);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    const activeIndex = swiper.activeIndex;
    const numSlides = slides.length;
    const normalizedIndex = (activeIndex % numSlides + numSlides) % numSlides;

    setCurrentSlideIndex(normalizedIndex);
    setAnimationKey(prevKey => prevKey + 1);
  }, [slides]);

  const handleSwiper = useCallback((swiper: SwiperClass) => {
    swiperRef.current = swiper;
  }, []);

  const numberOfPoints = slides.length;
  const angleIncrement = 360 / numberOfPoints;
  const circleRadius = 150;

  return (
    <div className="App">
      <div className="wrapper">
        <h1>Исторические<br />даты</h1>

        <div className="category-label">
          {slides[currentSlideIndex].category}
        </div>

        <div className="circle-container">
          <div
            className="circle"
            ref={circleRef}
            style={{}}
          > 

            {slides.map((slide, index) => {
              const rotationAngle = index * angleIncrement;

              const x = circleRadius * Math.cos((rotationAngle - 90) * Math.PI / 180);
              const y = circleRadius * Math.sin((rotationAngle - 90) * Math.PI / 180);

              const isActive = currentSlideIndex + 1 === index;
              

              return (
                <div
                  key={index}
                  className={`circle-point ${isActive ? 'active' : ''}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                  }}
                  onClick={() => swiperRef.current?.slideTo(index, 500)}
                >
                  <div className="point-number-container"  style={{ transform: `rotate(${currentSlideIndex * 360 / slides.length}deg)` }}>
                    <span className="point-number">{index + 1}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="year-counter">
          <AnimatedNumber
            number={slides[currentSlideIndex].startYear}
            animationKey={`start-${animationKey}`}
            color="#5d5fe7"
          />
          <AnimatedNumber
            number={slides[currentSlideIndex].endYear}
            animationKey={`end-${animationKey}`}
            color="#de67a6"
          />
        </div>

        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, A11y]}
          loop={true}
          className="swiper1"
          onSlideChange={handleSlideChange}
          onSwiper={handleSwiper}
          speed={500}
        >
          <SwiperSlide>
              <div>
              <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, A11y]}
                    loop={true}
                    speed={500}>
                  <SwiperSlide>
                    <div className="year">2015</div> 
                    <div className="description">
                      13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2016</div> 
                    <div className="description">
                    Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>3
                    <div className="year">2016</div> 
                    <div className="description">
                        Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2017</div> 
                    <div className="description">
                    13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>

                </Swiper>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
              <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, A11y]}
                    loop={true}
                    speed={500}>
                  <SwiperSlide>
                    <div className="year">2015</div> 
                    <div className="description">
                      13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2016</div> 
                    <div className="description">
                    Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>3
                    <div className="year">2016</div> 
                    <div className="description">
                        Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2017</div> 
                    <div className="description">
                    13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>

                </Swiper>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
              <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, A11y]}
                    loop={true}
                    speed={500}>
                  <SwiperSlide>
                    <div className="year">2015</div> 
                    <div className="description">
                      13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2016</div> 
                    <div className="description">
                    Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>3
                    <div className="year">2016</div> 
                    <div className="description">
                        Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2017</div> 
                    <div className="description">
                    13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>

                </Swiper>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
              <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, A11y]}
                    loop={true}
                    speed={500}>
                  <SwiperSlide>
                    <div className="year">2015</div> 
                    <div className="description">
                      13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2016</div> 
                    <div className="description">
                    Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>3
                    <div className="year">2016</div> 
                    <div className="description">
                        Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2017</div> 
                    <div className="description">
                    13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>

                </Swiper>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
              <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, A11y]}
                    loop={true}
                    speed={500}>
                  <SwiperSlide>
                    <div className="year">2015</div> 
                    <div className="description">
                      13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2016</div> 
                    <div className="description">
                    Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>3
                    <div className="year">2016</div> 
                    <div className="description">
                        Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2017</div> 
                    <div className="description">
                    13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>

                </Swiper>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div>
                                  <Swiper
                    spaceBetween={50}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    modules={[Navigation, Pagination, A11y]}
                    loop={true}
                    speed={500}>
                  <SwiperSlide>
                    <div className="year">2015</div> 
                    <div className="description">
                      13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2016</div> 
                    <div className="description">
                    Телескоп «Хаббл» обнаружил самую удалённую из всех обнаруженных галактик, получившую обозначение GN-z11
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>3
                    <div className="year">2016</div> 
                    <div className="description">
                        Компания Tesla официально представила первый в мире электрический грузовик Tesla Semi
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="year">2017</div> 
                    <div className="description">
                    13 сентября — частное солнечное затмение, видимое в Южной Африке и части Антарктиды
                    </div>
                  </SwiperSlide>

                </Swiper>
              </div>
            </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default App;