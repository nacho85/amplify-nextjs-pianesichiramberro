import styles from "./quote-result.module.css";
import React, { useState } from "react";
import {
  vehicleWebResultCoverages,
  vehicleWebResultCoverageTags,
} from "../../services/LocalSettings";
import { Box, Modal } from "@mui/material";
import imgWp from "../../images/wp.png";
import imgInfo from "../../images/info.png";
import imgArrowRight from "../../images/arrow-right.png";
import Image from "next/image";
import Link from "next/link";
import Carousel from "react-material-ui-carousel";

const QuoteResult = ({ data }) => {
  const [selectedTag, setSelectedTag] = useState(0);
  const [selectedCarouselIndex, setSelectedCarouselIndex] = useState(0);

  function closeModal() {
    setSelectedTag(0);
  }

  const handleTagInfoClick = (id) => {
    setSelectedTag(id);
  };

  let carouselElements = [];
  vehicleWebResultCoverages.forEach((cov) => {
    for (let index = 0; index < cov.items.length; index++) {
      const item = cov.items[index];
      var coverageInfo = data.desglose.find((c) => c.descripcion === item.code);
      if (coverageInfo) {
        carouselElements.push({
          code: item.code,
          name: coverageInfo.descripcionLarga,
          price: new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "USD",
            currencyDisplay: "narrowSymbol",
          }).format(coverageInfo.premio),
          tags: item.tags,
        });
        break;
      }
    }
  });

  return (
    <div className={styles.quoteResultContainer}>
      <Modal
        className={styles.modalContainer}
        onClose={closeModal}
        open={selectedTag > 0}
      >
        <Box className={styles.modalBox}>
          <button
            className={styles.btnClose}
            onClick={closeModal}
            type="button"
          >
            <span aria-hidden="true">×</span>
          </button>
          <br />
          <h2>
            {selectedTag > 0 &&
              vehicleWebResultCoverageTags.find(
                (t) => t.id === parseInt(selectedTag)
              ).title}
          </h2>
          <br />
          <div>
            {selectedTag > 0 && (
              <p>
                {
                  vehicleWebResultCoverageTags.find(
                    (t) => t.id === parseInt(selectedTag)
                  ).description
                }
              </p>
            )}
          </div>
        </Box>
      </Modal>
      <div style={{ marginBottom: "5px" }}>
        {/*<Image
            src={imgZurich}
            alt='Zurich'
    />*/}
      </div>
      <div className={styles.headerContainer}>
        <div>
          <h2>Te ofrecemos estas coberturas</h2>
          <div className={styles.brandDesc}>
            {data.vehiculoDescripcion}{" "}
            <span className="cotizacion-resultado-vehiculo-anio-inline">
              {data.items[0].anio}
            </span>
          </div>
        </div>
        <div className={styles.amountContainer}>
          Suma Asegurada:
          <b>
            {" "}
            $
            {new Intl.NumberFormat("es-AR").format(data.items[0].valorVehiculo)}
          </b>
        </div>
      </div>
      <p className={styles.comLabel}><b>En breve, un asesor va a comunicarse para asesorarte.</b></p>
      <p className={styles.infoLabel}>
        Los siniestros de pérdida total, robo o hurto del vehículo, se pagan a
        valor de reposición actualizado.
        <br />
        <b>Beneficio 0km:</b> Reposición del vehículo a valor de un 0km por 2
        años.
      </p>
      <p className={styles.infoTextCell}>
        Deslizá sobre las coberturas para comparar precios y alcance de cada
        una.
      </p>
      <div>
        {data.desglose && data.desglose.length > 0 && (
          <div className={styles.resultsGrid}>
            {
              <div className={styles.carousel}>
                <Carousel
                  autoPlay={false}
                  swipe={true}
                  cycleNavigation={false}
                  interval={500}
                  duration={500}
                  animation="slide"
                  navButtonsAlwaysVisible={false}
                  navButtonsAlwaysInvisibleisible={true}
                  onChange={(e) => {
                    setSelectedCarouselIndex(e);
                  }}
                >
                  {carouselElements.map((e, i) => (
                    <div key={i}>
                      <div className={styles.headerCell}>
                        <div className={styles.coverageDesc}>{e.name}</div>
                        <div style={{ paddingBottom: "0px" }}>
                          <span className={styles.price}>{e.price}</span> /mes
                        </div>
                      </div>
                    </div>
                  ))}
                </Carousel>
                <div
                  className={styles.headerCell}
                  style={{ marginTop: "15px" }}
                >
                  {vehicleWebResultCoverageTags.map((tag, tagIndex) => {
                    var tagFound = carouselElements[
                      selectedCarouselIndex
                    ].tags.find((t) => t === tag.id);
                    return (
                      <div
                        key={tagIndex}
                        className={styles.infoCell}
                        onClick={() => {
                          handleTagInfoClick(tag.id);
                        }}
                      >
                        <label className={styles.tagTitle}>{tag.title}</label>
                        {tagFound ? (
                          <svg
                            className={styles.check}
                            data-icon="check-circle"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            width="32"
                            height="32"
                          >
                            <path
                              fill="currentColor"
                              d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                            ></path>
                          </svg>
                        ) : (
                          <svg
                            className={styles.uncheck}
                            data-icon="times-circle"
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            width="32"
                            height="32"
                          >
                            <path
                              fill="currentColor"
                              d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                            ></path>
                          </svg>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            {
              <div className={styles.columnCoverage}>
                <div
                  className={`${styles.headerCell} ${styles.tagHeader}`}
                ></div>
                {vehicleWebResultCoverageTags.map((tag, tagIndex) => {
                  return (
                    <div key={tagIndex} className={styles.infoCell}>
                      <label className={styles.tagTitle}>{tag.title}</label>
                      {
                        <Image
                          src={imgInfo}
                          className={styles.tagInfo}
                          alt="Ver información"
                          onClick={() => {
                            handleTagInfoClick(tag.id);
                          }}
                        />
                      }
                    </div>
                  );
                })}
              </div>
            }
            {vehicleWebResultCoverages.map((webResultCoverageGroup, index) => {
              var elementToReturn;
              webResultCoverageGroup.items.map((webResultCoverageItem) => {
                if (!elementToReturn) {
                  var coverageInfo = data.desglose.find(
                    (c) => c.descripcion === webResultCoverageItem.code
                  );
                  if (coverageInfo) {
                    elementToReturn = (
                      <div key={index} className={styles.columnCoverage}>
                        <div className={styles.headerCell}>
                          <div className={styles.coverageDesc}>
                            {coverageInfo.descripcionLarga}
                          </div>
                          <div
                            className="quote-card-price"
                            style={{ paddingBottom: "0px" }}
                          >
                            {new Intl.NumberFormat("es-AR", {
                              style: "currency",
                              currency: "USD",
                              currencyDisplay: "narrowSymbol",
                            }).format(coverageInfo.premio)}{" "}
                            /mes
                          </div>
                        </div>
                        <div>
                          {vehicleWebResultCoverageTags.map((tag, tagIndex) => {
                            var tagFound = webResultCoverageItem.tags.find(
                              (t) => t === tag.id
                            );
                            return (
                              <div key={tagIndex} className={styles.infoCell}>
                                {tagFound ? (
                                  <svg
                                    className={styles.check}
                                    data-icon="check-circle"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    width="32"
                                    height="32"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
                                    ></path>
                                  </svg>
                                ) : (
                                  <svg
                                    className={styles.uncheck}
                                    data-icon="times-circle"
                                    role="img"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 512 512"
                                    width="32"
                                    height="32"
                                  >
                                    <path
                                      fill="currentColor"
                                      d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"
                                    ></path>
                                  </svg>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                }
                return <></>;
              });
              return !elementToReturn ? null : elementToReturn;
            })}
          </div>
        )}
      </div>
      <div className={styles.wp}>
        <Link
          href={
            "//wa.me/5492284680187?text=Hola!%20Quiero%20conocer%20m%C3%A1s%20acerca%20del%20seguro%20para%20mi%20auto."
          }
          className={styles.whatsappLink}
          target="_blank"
          rel="noreferrer"
        >
          <div className={styles.whatsappBox}>
            <div className={styles.whatsappGreenBox}>
              <Image
                src={imgWp}
                className={styles.whatsappLogo}
                alt="Whatsapp"
              />
            </div>
            <div className={styles.whatsappContent}>
              <div>
                ¿Tenés dudas? Consultanos por <b>Whatsapp</b>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default QuoteResult;
