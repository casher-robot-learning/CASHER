import { useState, useRef, useEffect } from 'react'
import './App.css'
import { USDZScene } from './usdzutils'

import video1 from './assets/materials/videos/teaser_casher2.mp4'
// import video2 from './assets/materials/videos/mugandshelfdisturbances.mp4';
import video3 from './assets/materials/videos/scanned_deployment_finetuning.mp4';
import video4 from './assets/materials/videos/smaller/snack_overflow_right.mp4';
import video5 from './assets/materials/videos/smaller/me_ugrad_left.mp4';
import video6 from './assets/materials/videos/smaller/me_conf.mp4';
import video7 from './assets/materials/videos/smaller/mccarty_floor_2_right.mp4';
import video8 from './assets/materials/videos/smaller/mccarty_floor_1_left.mp4';
import video9 from './assets/materials/videos/smaller/multiobject-zeroshot-all3.mp4';
import video10 from './assets/materials/videos/smaller/multiobject-zeroshot.mp4';
import video11 from './assets/materials/videos/smaller/multiobject-zeroshot-all3.mp4';
import video12 from './assets/materials/videos/smaller/multiobject-zeroshot.mp4';
import video13 from './assets/materials/videos/smaller/lowlight-zeroshot.mp4';
import video14 from './assets/materials/videos/smaller/messy-zerosot.mp4';
import video15 from './assets/materials/videos/smaller/disturbance-zeroshot.mp4';
import video16 from './assets/materials/videos/smaller/obj2cab-lowlight-fewshot.mp4';
import video17 from './assets/materials/videos/smaller/obj2cab-messy-fewshot.mp4';
import video18 from './assets/materials/videos/casher-pipeline.mp4';
import video19 from './assets/materials/videos/crowdsourcing.mp4';
import video20 from './assets/materials/videos/gui.mp4';
import video21 from './assets/materials/videos/demo.mp4';
import video22 from './assets/materials/videos/rlfinetune.mp4';
import video23 from './assets/materials/videos/teacherstudentdistillation.mp4';
import video24 from './assets/materials/videos/obj2sink.mp4';
import video25 from './assets/materials/videos/obj2cabinet.mp4';
import video26 from './assets/materials/videos/opencabinet.mp4';

let viewerIsReady;
if ('serviceWorker' in navigator) {
  console.log("service worker")
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}coi-serviceworker.js`)
    .then(registration => {
      console.log('SW registered: ', registration)

      if (!sessionStorage.getItem('reloaded')) {
        // Set the flag in sessionStorage
        sessionStorage.setItem('reloaded', 'true');
        // Reload the page
        location.reload();
      }
      let demo = new USDZScene()
      demo.init(viewerIsReady)

    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError)
    })
  })
}

const loading = document.createElement('h1');
loading.textContent = 'LOADING...';

function App() {

  const canvasContainerRef = useRef(null);
  const [viewerReady, setViewerReady] = useState(false);
  
  viewerIsReady = (val, elements, demo) => {
    console.log(val)
    console.log(elements)
    console.log(demo)
    console.log(canvasContainerRef)
    setViewerReady(val)
    canvasContainerRef.current.removeChild(canvasContainerRef.current.firstChild)

    if (val)  { 
      canvasContainerRef.current.appendChild(elements[0])
    } else {
      canvasContainerRef.current.appendChild(loading)
    }
    // canvasContainerRef.current.appendChild(elements[1])
    demo.setSize(canvasContainerRef.current.clientWidth, canvasContainerRef.current.clientHeight)
  };

  useEffect(() => {
    canvasContainerRef.current.appendChild(loading);

    
    // Dynamically load additional scripts if required
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };
  
    const loadDependencies = async () => {
      try {
        // Load jQuery (if needed for other scripts)
        await loadScript("https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js");
        
        // Load any additional scripts
        await loadScript('https://cdn.jsdelivr.net/npm/bulma-carousel@4.0.24/dist/js/bulma-carousel.min.js');

        // Initialize the Bulma Carousel
        if (window.bulmaCarousel) {
          window.bulmaCarousel.attach("#results-carousel", {
            slidesToScroll: 3,
            slidesToShow: 3,
            loop: true,
            autoplay: true,
            autoplaySpeed: 3000,
            pauseOnHover: true,
          });
          console.log("Bulma Carousel initialized successfully.");
        } else {
          console.error("Bulma Carousel script did not load correctly.");
        }

        await loadScript('https://cdn.jsdelivr.net/npm/bulma-slider@2.0.5/dist/js/bulma-slider.min.js');
        console.log("Additional scripts loaded successfully.");
      } catch (error) {
        console.error("Failed to load scripts", error);
      }
    };
  
    loadDependencies();

    return () => {
      if (canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(canvasContainerRef.current.firstChild)
        
      }
    };
  }, []);


  return (
    <>
      
        <div id='container'>




    <div className="paper-title">
        <br></br>
    <h1> 
      <b className="method">CASHER</b>: Robot Learning with Super-Linear Scaling</h1>
    </div>

    <div id="authors">
        <center>
            <div className="author-row-new">
                <a href="https://marceltorne.github.io/">Marcel Torne<sup>1,3,*</sup></a>,
                <a href="https://arhanjain.github.io/">Arhan Jain<sup>2,*</sup></a>,
                <a href="https://yuanjiayiy.github.io/">Jiayi Yuan<sup>2,*</sup></a>,
                <a href="https://www.linkedin.com/in/vidyaaranya-macha/">Vidyaaranya Macha<sup>2,*</sup></a>,
                <a href="https://ankile.com/">Lars Lien Ankile<sup>1</sup></a>,
                <a href="https://anthonysimeonov.github.io/">Anthony Simeonov<sup>1</sup></a>,
                <br />
                <a href="https://people.eecs.berkeley.edu/~pulkitag/">Pulkit Agrawal<sup>1</sup></a>,
                <a href="https://abhishekunique.github.io">Abhishek Gupta<sup>2</sup></a>
            </div>
        </center>
        <center>
        <div className="affiliations">
            <span><sup>1</sup> Massachusetts Institute of Technology </span>
            <span><sup>2</sup> University of Washington</span>
            <span><sup>3</sup> Stanford University </span>
        </div>
        <div className="affiliations">
            <span><sup>*</sup> Equal contribution </span>
        </div>


        </center>

        <div >
            <div className="paper-btn-parent">
            <a className="paper-btn" href="">
                <span className="material-icons"> description </span> 
                 Paper
            </a>
            <a className="paper-btn" href="https://www.youtube.com/watch?v=s7U2Nk3oPog">
              <span className="material-icons" > movie </span>
              Video 
          </a>
            <a className="paper-btn" href="https://github.com/real-to-sim-to-real/RialToGUI">
                <span className="material-icons"> link </span>
                GUI 
            </a>
            <a className="paper-btn" href="https://github.com/casher-robot-learning/USDAssets">
              <span className="material-icons"> link </span>
              Assets 
          </a>

                  
            </div>
        </div>
    </div>
    <div className="columns is-centered">
      <div className="column">
          <video id="method-video"
          muted
          autoPlay
          loop
          width="80%">
          <source src={video1}
          type="video/mp4"></source>
          </video>
      </div>
      </div>
      <div id="authors">
      <div className="columns is-centered has-text-centered">
        <div className="column is-four-fifths">
          <h2 className="subtitle has-text-centered">
            <b className="method">CASHER</b> proposes a new technique using Real-to-Sim-to-Real for training and fine-tuning generalist policies in simulation with super-linear scaling with respect to the amount of human demonstrations provided.
          </h2>

        </div>
    </div>

      </div>



    <hr></hr>
    <section>

    <div className="columns is-centered">
        <div className="column is-four-fifths">
          <h2 className="title is-3">Abstract</h2>
          <div id="abstract" className="flex-row">
            <p>
              Scaling robot learning requires data collection pipelines
            that scale favorably with human effort to ensure a
            sufficient diversity and quality of expert data. In this
            work, we propose Crowdsourcing and Amortizing Human Effort
            for Real-to-Sim-to-Real (<b>CASHER</b>), a pipeline for scaling up
            data collection and learning generalist policies where the
            performance scales superlinearly with respect to human
            effort. The key idea is to crowdsource digital twins of
            real-world scenes using 3D reconstruction techniques and
            collect large-scale data in these simulation scenes, rather
            than in the real-world. Data collection in simulation is
            initially driven by reinforcement learning bootstrapped
            with human demonstrations. However, as the training of a
            generalist policy progresses across environments, the
            generalization capabilities of the learned generalist
            policy can be used to replace human effort with model
            generated demonstrations. This results in a pipeline where
            environments are easily sourced from non-experts through 3D
            capture, while behavioral data is collected with
            continually reducing amounts of human effort. We analyze
            the zero-shot and few-shot scaling laws of <b>CASHER</b> on three
            real-world tasks: placing mugs/bowls/cups into a sink,
            placing boxes on a shelf and opening cabinets across a
            diverse range of environments. We also demonstrate the
            capabilities of the <b>CASHER</b> pipeline to finetune trained
            policies in a target scenario using a novel unsupervised
            fine-tuning technique that can improve behavior simply
            using 3D environments scans at test time, without requiring
            additional human demonstrations.
            </p>
        </div>
        </div>
      </div>
    </section>
      <hr></hr>
      <section>
      <h2 className="title is-3">In <b className="method">CASHER</b> we train a generalist policy with Real-to-Sim-to-Real.</h2>

      <div className="centered-container" style={{"widht": "70em", "height": "40em"}}>
        <div id="viz" className="viz" ></div>
        <div className="web-viewer" ref={canvasContainerRef} ></div>
        <em className="interactive">Play with me! Interactive 3D visualization</em>
      </div>

            
      </section>
      <hr></hr>
      <section>
      <div className="columns is-centered">
        <div className="column">
          <h2 className="title is-3"><b className="method">CASHER</b>'s paradigm allows us to finetune generalist policies without additional human demos on a digital twin of your target environment. </h2>

        <div className="columns is-centered">
          <div className="column">
            <video id="method-video"
            muted
            autoPlay
            loop

            width="80%">
            <source src={video3}
            type="video/mp4"></source>
            </video>
          </div>
        </div>
      </div>


    </div>
    </section>
    <hr></hr>

    <section>

    <div className="columns is-centered">
      <div className="column">
        <h2 className="title is-2">Robustness of <b className="method">CASHER</b></h2>
      </div>
    </div>
    </section>
  <section id="overview-videos">
      <div className="columns is-centered">
          <div className="column">
            <h2 className="title is-3">Out-of-distribution environments and objects</h2>
            <section className="hero is-light is-small">
              <div className="hero-body">
                <div className="container">
                  <div id="results-carousel" className="carousel results-carousel">
                    <div className="item item-steve">
                      <video poster="" id="steve" autoPlay controls muted loop playsinline height="100%">
                        <source src={video4}
                                type="video/mp4"></source>
                      </video>
                    </div>
                    <div className="item item-chair-tp">
                      <video poster="" id="chair-tp" autoPlay controls muted loop playsinline height="100%">
                        <source src={video5}
                                type="video/mp4"></source>
                      </video>
                    </div>
                    <div className="item item-chair-tp">
                      <video poster="" id="chair-tp" autoPlay controls muted loop playsinline height="100%">
                        <source src={video6}
                                type="video/mp4"></source>
                      </video>
                    </div>
                    <div className="item item-steve">
                      <video poster="" id="steve" autoPlay controls muted loop playsinline height="100%">
                        <source src={video7}
                                type="video/mp4"></source>
                      </video>
                    </div>
                    <div className="item item-steve">
                      <video poster="" id="steve" autoPlay controls muted loop playsinline height="100%">
                        <source src={video8}
                                type="video/mp4"></source>
                      </video>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      <div className="columns is-centered">
          <div className="column">
            <h2 className="title is-3">Multi-object Settings</h2>
            <section className="hero is-light is-small">
              <div className="hero-body">
                  <div className="container">
                    <div id="results-carousel" className="carousel results-carousel">
                      <div className="item item-chair-tp">
                        <video poster="" id="chair-tp" autoPlay controls muted loop playsinline height="300px">
                          <source src={video9}
                                  type="video/mp4"></source>
                        </video>
                      </div>
                      <div className="item item-chair-tp">
                        <video poster="" id="chair-tp" autoPlay controls muted loop playsinline height="300px">
                          <source src={video10}
                                  type="video/mp4"></source>
                        </video>
                      </div>
                      <div className="item item-chair-tp">
                        <video poster="" id="chair-tp" autoPlay controls muted loop playsinline height="300px">
                          <source src={video11}
                                  type="video/mp4"></source>
                        </video>
                      </div>
                      <div className="item item-chair-tp">
                        <video poster="" id="chair-tp" autoPlay controls muted loop playsinline height="300px">
                          <source src={video12}
                                  type="video/mp4"></source>
                        </video>
                      </div>
                    </div>
                  </div>
                </div>
            </section>
          </div>
      </div>

      <div className="columns is-centered">
          <div className="column">
            <h2 className="title is-3">Messy environments, Lighting, and Physical Disturbances</h2>
            <section className="hero is-light is-small">
              <div className="hero-body">
                  <div className="container">
                    <div id="results-carousel" className="carousel results-carousel">
                      <div className="item item-steve">
                        <video poster="" id="steve" autoPlay controls muted loop playsinline height="300px">
                          <source src={video13}
                                  type="video/mp4"></source>
                        </video>
                      </div>
                      <div className="item item-chair-tp">
                        <video poster="" id="chair-tp" autoPlay controls muted loop playsinline height="300px">
                          <source src={video14}
                                  type="video/mp4"></source>
                        </video>
                      </div>
                      <div className="item item-blueshirt">
                          <video poster="" id="blueshirt" autoPlay controls muted loop playsinline height="300px">
                            <source src={video15}
                                    type="video/mp4"></source>
                          </video>
                      </div>
                      <div className="item item-blueshirt">
                          <video poster="" id="blueshirt" autoPlay controls muted loop playsinline height="300px">
                            <source src={video16}
                                    type="video/mp4"></source>
                          </video>
                        </div>
                        <div className="item item-blueshirt">
                          <video poster="" id="blueshirt" autoPlay controls muted loop playsinline height="300px">
                            <source src={video17}
                                    type="video/mp4"></source>
                          </video>
                        </div>
                    </div>
                  </div>
                </div>
            </section>
          </div>
      </div>
    </section>
     
      <hr></hr>
    <section>
    <div className="columns is-centered">
        <div className="column">
          <h2 className="title is-3"><b className="method">CASHER</b> Overview</h2>
          <div className="columns is-centered spaced">
            <div className="column">
              <video id="method-video"
              muted
              autoPlay
              loop
    
              width="80%">
              <source src={video18}
              type="video/mp4"></source>
              </video>
            </div>
          </div>

          <h2 className="title is-4 spaced">1. Crowdsource a batch of real world scenes. </h2>
          <div className="columns is-centered spaced2">
                <div className="column">
                    <video id="method-video"
                    controls
                    muted
                    // autoPlay
                    // loop

                    width="80%">
                    <source src={video19}
                    type="video/mp4"></source>
                    </video>
                </div>
            </div>

            <h2 className="title is-4 spaced">2. (Optional) Create articulated object and mark the site in GUI.</h2>
            <div className="columns is-centered spaced2">
              <div className="column">
                  <video id="method-video"
                  controls
                  muted
                  // autoPlay
                  // loop
  
                  width="80%">
                  <source src={video20}
                  type="video/mp4"></source>
                  </video>
              </div>
            </div>

          <h2 className="title is-4 spaced">3. Collect demonstrations in the simulation.</h2>
          <div className="columns is-centered spaced2">
            <div className="column">
                <video id="method-video"
                controls
                muted
                // autoPlay
                // loop

                width="80%">
                <source src={video21}
                type="video/mp4"></source>
                </video>
            </div>
            </div>
          <h2 className="title is-4 spaced">4. RL fine-tuning from demonstrations. </h2>
          <div className="columns is-centered spaced2">
            <div className="column">
                <video id="method-video"
                controls
                muted
                // autoPlay
                // loop

                width="80%">
                <source src={video22}
                type="video/mp4"></source>
                </video>
            </div>
            </div>
          <h2 className="title is-4 spaced">5. Teacher-student distillation from state-based policy to a generalist visuomotor policy.</h2>
          <div className="columns is-centered spaced2">
            <div className="column">
                <video id="method-video"
                controls
                muted
                // autoPlay
                // loop

                width="80%">
                <source src={video23}
                type="video/mp4"></source>
                </video>
            </div>
            </div>
        </div>
      </div>
      </section>
  <hr></hr>

      <section>
      <div className="columns is-centered">
        <div className="column">
          <h2 className="title is-2">Tasks</h2>
        </div>
      </div>
      <h2 className="title is-4">Pick up bowl/cup/mug and put into the sink</h2>
        <div className="columns is-centered">
          <div className="column">
              <video id="method-video"
              muted
              autoPlay
              width="80%">
              <source src={video24}
              type="video/mp4"></source>
              </video>
          </div>
        </div>
      <h2 className="title is-4">Pick up box and put into the cabinet</h2>
        <div className="columns is-centered">
          <div className="column">
              <video id="method-video"
              muted
              autoPlay
              loop

              width="80%">
              <source src={video25}
              type="video/mp4"></source>
              </video>
          </div>
        </div>
      <h2 className="title is-4">Open the cabinet</h2>
        <div className="columns is-centered">
          <div className="column">
              <video id="method-video"
              muted
              autoPlay
              loop

              width="80%">
              <source src={video26}
              type="video/mp4"></source>
              </video>
          </div>
        </div>
        </section>
  
        

        <section className="section" id="BibTeX">
          <div className="container is-max-desktop content">
            <h2 className="title">BibTeX</h2>
            <pre>
              <code>
                {`@article{torne2024casher,
          author    = {Torne, Marcel 
                      and Jain, Arhan 
                      and Vidyaaranya, Macha 
                      and Yuan, Jiayi 
                      and Ankile, Lars Lien
                      and Simeonov, Anthony
                      and Gupta, Abhishek 
                      and Agrawal, Pulkit},
          title     = {Robot Learning with Super-Linear Scaling},
          journal   = {Arxiv},
          year      = {2024},
        }`}
              </code>
            </pre>
          </div>
        </section>


      <footer className="footer">
          <div className="columns is-centered">
              <div className="content">
                <p>
                    This webpage template was inspired from <a href='https://nv-tlabs.github.io/LION/'>LION</a>, <a href='https://nerfies.github.io'>Nerfies</a>, <a href='https://liruiw.github.io/policycomp/'>PoCo</a> and <a href='https://human-guided-exploration.github.io/HuGE/'>HuGE</a>.
                </p>
            </div>
        </div>
      </footer>
      


      </div>
    
    </>
  )
}

export default App
