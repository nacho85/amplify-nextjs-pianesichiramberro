"use client";
import styles from "./quoter-car.module.css";
import imgCar from "../../images/car.png";
import imgHome from "../../images/home.png";
import imgLoading from "../../images/loading.gif";
import SelectModal from "./select-modal";
import Image from "next/image";
import Link from "next/link";
import SelectBrand from "./select-brand";
import SelectGeneric from "./select-generic";
import { useState } from "react";
import { acceptedYears, getVersions } from "@/services/InfoautoService";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import Autocomplete from "./autocomplete";
import {
  cities,
  ageItems,
  sexItems,
  vehicleWebResultCoverages,
} from "@/services/LocalSettings";
import { postQuoteWeb } from "@/services/QuoteService";
import { sendMailCotizacionResultado } from "@/services/EmailService";

const QuoterCar = ({ brands, setResultQuote }) => {
  const [modalState, setModalState] = useState({
    modalBrandsOpen: false,
    modalModelsOpen: false,
    modalYearsOpen: false,
    modalVersionsOpen: false,
    modalDataOpen: false,
  });
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [versions, setVersions] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [hasGas, setHasGas] = useState(false);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [selectedFirstName, setSelectedFirstName] = useState("");
  const [selectedAge, setSelectedAge] = useState(35);
  const [selectedSex, setSelectedSex] = useState("M");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quotingStatus, setQuotingStatus] = useState(null);

  const handleBrandSelect = (item) => {
    setSelectedModel(null);
    setModels(
      item
        ? item.models
            .filter(
              (m) => m.prices_from && m.prices_to && m.prices_to > acceptedYears
            )
            .sort((a, b) => {
              if (a.name > b.name) return 1;
              if (a.name < b.name) return -1;
              return 0;
            })
        : []
    );
    setSelectedBrand(item);
    setSelectedYear(null);
    setYears([]);
    setSelectedVersion(null);
    setVersions([]);
    setModalState({
      ...modalState,
      modalBrandsOpen: false,
      modalModelsOpen: true,
    });
  };

  const handleModelSelect = (item) => {
    setSelectedModel(item);
    let init =
      item?.prices_from > acceptedYears ? item.prices_from : acceptedYears;
    let validYears = [];
    for (let index = new Date().getFullYear(); index > init; index--) {
      if (index === new Date().getFullYear()) {
        validYears.push({
          value: index,
          text: index.toString() + " (0km)",
          is0km: true,
        });
      }
      validYears.push({ value: index, text: index.toString() });
    }
    setYears(item ? validYears : []);
    setSelectedYear(null);
    setSelectedVersion(null);
    setVersions([]);
    setModalState({
      ...modalState,
      modalModelsOpen: false,
      modalYearsOpen: true,
    });
  };

  const handleYearSelect = (item) => {
    setSelectedYear(item);
    if (item) {
      getVersions(
        selectedBrand.id,
        selectedModel.id,
        item.value,
        handleVersionsResult
      );
      setLoading(true);
      setModalState({
        ...modalState,
        modalYearsOpen: false,
        modalVersionsOpen: true,
      });
    }
  };

  const handleVersionsResult = (versions) => {
    setVersions(versions);
    setLoading(false);
  };

  const handleVersionSelect = (item) => {
    setSelectedVersion(item);
    setModalState({
      ...modalState,
      modalVersionsOpen: false,
    });
  };

  const isFormValid =
    selectedBrand && selectedModel && selectedYear && selectedVersion;

  const isFormDataValid =
    selectedAge &&
    selectedSex &&
    selectedCity &&
    selectedFirstName?.length > 1 &&
    /^\d{10}$/.test(selectedPhone);

  const onFormSubmit = () => {
    if (isFormValid) {
      setModalState({
        ...modalState,
        modalDataOpen: true,
      });
    }
  };

  const handleCitySelect = (item) => {
    setSelectedCity(item);
  };

  const handleAgeSelect = (e) => {
    setSelectedAge(e.target.value);
  };

  const handleSexSelect = (e) => {
    setSelectedSex(e.target.value);
  };

  const closeBrands = () => {
    setModalState({
      ...modalState,
      modalBrandsOpen: false,
    });
  };

  const closeModels = () => {
    setModalState({
      ...modalState,
      modalModelsOpen: false,
    });
  };

  const closeYears = () => {
    setModalState({
      ...modalState,
      modalYearsOpen: false,
    });
  };

  const closeVersions = () => {
    setModalState({
      ...modalState,
      modalVersionsOpen: false,
    });
  };

  const handleFormDataSubmit = (e) => {
    e.preventDefault();
    if (isFormValid && isFormDataValid) {
      let payload = {
        vehicleCode: selectedVersion.value,
        vehicleYear: selectedYear.value,
        is0km: selectedYear.is0km,
        hasGas: hasGas,
        idCity: selectedCity.value,
        idProvince: selectedCity.idProvince,
        zipCode: selectedCity.zipCode,
        idSex: selectedSex,
        age: selectedAge,
      };
      postQuoteWeb(payload, handleQuoteResponse);
      setQuotingStatus("loading");
      setModalState({
        ...modalState,
        modalDataOpen: false,
      });
    }
  };

  const getPackages = (orden) => {
    var packages = [];
    vehicleWebResultCoverages.forEach((cov) => {
      for (let index = 0; index < cov.items.length; index++) {
        const item = cov.items[index];
        var coverageInfo = orden.desglose.find(
          (c) => c.descripcion === item.code
        );
        if (coverageInfo) {
          packages.push({
            name: coverageInfo.descripcionLarga,
            price: new Intl.NumberFormat("es-AR", {
              style: "currency",
              currency: "USD",
              currencyDisplay: "narrowSymbol",
            }).format(coverageInfo.premio),
          });
          break;
        }
      }
    });
    return packages;
  };

  const handleQuoteResponse = (response) => {
    if (!response || !response.data || response.data.estado === 0) {
      setQuotingStatus("error");
      return;
    }
    response.data.datosResultado.orden.vehiculoDescripcion =
      selectedBrand.name +
      " " +
      selectedModel.name +
      " " +
      selectedVersion.label;
    response.data.datosResultado.orden.age = selectedYear.text;
    response.data.datosResultado.orden.hasGas = hasGas;
    response.data.datosResultado.orden.is0km = selectedYear.is0km;

    const mailPayload = {
      name: selectedFirstName,
      email: selectedPhone,
      city: selectedCity.label,
      vehicle:
        selectedBrand.name +
        " " +
        selectedModel.name +
        " " +
        selectedVersion.label +
        " " +
        selectedYear.value,
      hasGas: hasGas,
      is0km: selectedYear.is0km,
      price:
        "$" +
        new Intl.NumberFormat("es-AR").format(
          response.data.datosResultado.orden.items[0].valorVehiculo
        ),
      age: selectedAge,
      packages: getPackages(response.data.datosResultado.orden),
    };
    sendMailCotizacionResultado(mailPayload, () => {});
    setResultQuote(response.data.datosResultado.orden);
  };

  return (
    <div className={styles.quoterContainer}>
      <h1>Cotizá y asegurá tu auto u hogar</h1>
      <div className={styles.quoterButtonsContainer}>
        <div className={`${styles.quoterButton} ${styles.quoterButtonActive}`}>
          <Image
            src={imgCar}
            className={styles.quoterButtonIcon}
            alt="Cotizá tu auto"
          />
          <label className={styles.quoterButtonLabel}>Autos</label>
        </div>
        <Link
          href={"//hogar.zurich.ar.onmtc.com/?ref=Pian-wjdL8"}
          className={styles.quoterButton}
          target="_blank"
        >
          <Image
            src={imgHome}
            className={styles.quoterButtonIcon}
            alt="Cotizá tu hogar"
          />
          <label className={styles.quoterButtonLabel}>Hogar</label>
        </Link>
      </div>
      <div className={styles.quoterPanel}>
        <p className={styles.quoterInfo}>
          En tan sólo unos pasos podrás cotizar tu vehículo y formar parte de
          nuestra comunidad.
        </p>
        {quotingStatus === "error" && (
          <div className={styles.loading}>
            <b>Hubo un problema al procesar la cotización.</b>
            <br />
            <div>
              <i>
                Por favor, intente nuevamente, o comuniquese directamente con
                nosotros. Muchas gracias.
              </i>
            </div>
          </div>
        )}
        {quotingStatus === "loading" && (
          <div className={styles.loading}>
            <Image src={imgLoading} alt="Cargando..." />
            Cotizando tu vehículo...
          </div>
        )}
        {!quotingStatus && (
          <>
            <form className={styles.quoterForm}>
              <SelectModal
                modalComponent={
                  <SelectBrand
                    brands={brands}
                    onBrandSelect={handleBrandSelect}
                    textField="name"
                  />
                }
                onClick={() => {
                  setModalState({
                    ...modalState,
                    modalBrandsOpen: true,
                  });
                }}
                onClose={closeBrands}
                open={modalState.modalBrandsOpen}
                placeholder={"Marca"}
                textField="name"
                value={selectedBrand}
              />
              <SelectModal
                disabled={!models.length > 0}
                modalComponent={
                  <SelectGeneric
                    items={models}
                    onItemSelect={handleModelSelect}
                    textField="name"
                  />
                }
                onClick={() => {
                  if (selectedBrand) {
                    setModalState({
                      ...modalState,
                      modalModelsOpen: true,
                    });
                  }
                }}
                onClose={closeModels}
                open={modalState.modalModelsOpen}
                placeholder="Modelo"
                textField="name"
                value={selectedModel}
              />
              <SelectModal
                disabled={!years.length > 0}
                modalComponent={
                  <SelectGeneric
                    items={years}
                    onItemSelect={handleYearSelect}
                    textField="text"
                  />
                }
                onClick={() => {
                  if (selectedBrand && selectedModel) {
                    setModalState({
                      ...modalState,
                      modalYearsOpen: true,
                    });
                  }
                }}
                onClose={closeYears}
                open={modalState.modalYearsOpen}
                placeholder="Año"
                textField="text"
                value={selectedYear}
              />
              <SelectModal
                disabled={!versions.length > 0}
                modalComponent={
                  <>
                    {loading && (
                      <div className={styles.loading}>
                        <Image src={imgLoading} alt="Cargando..." />
                        Obteniendo la información...
                      </div>
                    )}
                    {!loading && (
                      <>
                        <FormControlLabel
                          className={styles.gasBox}
                          control={
                            <Checkbox
                              onChange={() => {
                                setHasGas(!hasGas);
                              }}
                              checked={hasGas}
                            />
                          }
                          label="Mi vehículo tiene GNC"
                        />
                        <SelectGeneric
                          items={versions}
                          onItemSelect={handleVersionSelect}
                          textField="label"
                        />
                      </>
                    )}
                  </>
                }
                onClick={() => {
                  if (selectedBrand && selectedModel && selectedYear) {
                    setModalState({
                      ...modalState,
                      modalVersionsOpen: true,
                    });
                  }
                }}
                onClose={closeVersions}
                open={modalState.modalVersionsOpen}
                placeholder="Versión"
                textField="label"
                value={selectedVersion}
              />
            </form>
            <input
              className={styles.submitButton}
              disabled={!isFormValid}
              onClick={onFormSubmit}
              type="submit"
              value={"Generar cotización"}
            />
          </>
        )}
        {
          <Modal
            className={styles.modalDataContainer}
            open={modalState.modalDataOpen}
          >
            <Box className={styles.modalDataBox}>
              <div>
                <h4 className={styles.formDataTitle}>
                  Necesitamos unos datos más...
                </h4>
                <form className={styles.formData}>
                  <TextField
                    className={styles.formDataInput}
                    label="Nombre"
                    onChange={(e) => {
                      setSelectedFirstName(e.target.value);
                    }}
                    value={selectedFirstName}
                    variant="standard"
                  />
                  <TextField
                    className={styles.formDataInput}
                    label="Tel./Celular"
                    type="number"
                    onChange={(e) => {
                      if (e.target.value?.length <= 10) {
                        setSelectedPhone(e.target.value);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                    value={selectedPhone}
                    variant="standard"
                  />
                  <div className={styles.nameContainer}>
                    <FormControl
                      className={styles.formDataInput}
                      variant="standard"
                    >
                      <InputLabel id="select-age-label">Edad</InputLabel>
                      <Select
                        labelId="select-age-label"
                        value={selectedAge}
                        onChange={handleAgeSelect}
                        label="Sexo"
                      >
                        {ageItems.map((i, ix) => {
                          return (
                            <MenuItem key={ix} value={i.value}>
                              {i.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div className={styles.spaceBetween}>&nbsp;&nbsp;</div>
                    <FormControl
                      className={styles.formDataInput}
                      variant="standard"
                    >
                      <InputLabel id="select-sex-label">Sexo</InputLabel>
                      <Select
                        labelId="select-sex-label"
                        value={selectedSex}
                        onChange={handleSexSelect}
                        label="Sexo"
                      >
                        {sexItems.map((i, ix) => {
                          return (
                            <MenuItem key={ix} value={i.value}>
                              {i.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </div>
                  <Autocomplete
                    className={styles.formDataInput}
                    items={cities}
                    limitResults={5}
                    minInputCharacters={3}
                    noResultText="No se encontró la localidad"
                    onSelect={handleCitySelect}
                    placeholder="Ingresá tu localidad"
                    resultsClassName={styles.formDataCityResults}
                    textField="label"
                    value={selectedCity}
                  />
                  <label className={styles.note}>
                    * La localidad en la cual circula con frecuencia el vehículo
                  </label>
                  <input
                    className={styles.submitButton}
                    disabled={!isFormDataValid}
                    onClick={handleFormDataSubmit}
                    type="submit"
                    value={"Ver la cotización"}
                  />
                  <label className={styles.recaptcha}>
                    Este sitio está protegido por reCAPTCHA y se aplican la
                    <Link
                      className={styles.linkRecaptcha}
                      href={"//policies.google.com/privacy"}
                      target="_blank"
                    >
                      &nbsp;política de privacidad&nbsp;
                    </Link>
                    y los
                    <Link
                      className={styles.linkRecaptcha}
                      href={"//policies.google.com/terms"}
                      target="_blank"
                    >
                      &nbsp;términos del servicio&nbsp;
                    </Link>
                    de Google
                  </label>
                </form>
              </div>
            </Box>
          </Modal>
        }
      </div>
    </div>
  );
};

export default QuoterCar;
