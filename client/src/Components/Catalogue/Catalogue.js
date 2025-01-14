import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCountries,
  cambioDePagina,
  searchCountry,
} from "../../Redux/Actions";
import Card from "../Card/Card.js";
import Error from "../Error/Error.js";
import "./Catalogue.css";
// "pagina=1&order=null&tipoOrder=null&continente=null&tipoDeTurismo=null"

const subRegiones = [
  "Eastern Africa",
  "Middle Africa",
  "Northern Africa",
  "Southern Africa",
  "Western Africa",
  "Caribbean",
  "Central America",
  "North America",
  "South America",
  "Central Asia",
  "Eastern Asia",
  "South-Eastern Asia",
  "Southern Asia",
  "Western Asia",
  "Eastern Europe",
  "Northern Europe",
  "Southern Europe",
  "Western Europe",
  "Australia and New Zealand",
  "Melanesia",
  "Micronesia",
  "Polynesia",
];

const Catalogue = () => {
  const [paginado, setPaginado] = useState([1]);
  const [orden, setOrden] = useState(null);
  const [tipoDeOrden, setTipoDeOrden] = useState(null);
  const [subRegion, setSubRegion] = useState(null);
  const [temporada, setTemporada] = useState(null);
  let dispatch = useDispatch();
  let parametroDeBusqueda = useSelector((state) => state.parametroDeBusqueda);
  let dataCountry = useSelector((state) => state.countries);
  let numeroDePagina = useSelector((state) => state.numeroPagina);
  let paginaActual = useSelector((state) => state.paginaActual);

  useEffect(() => {
    setPaginado(
      Array.from({ length: numeroDePagina }, (el, index) => index + 1)
    );
  }, [numeroDePagina]);

  useEffect(() => {
    dispatch(cambioDePagina(1));
  }, [dispatch, parametroDeBusqueda, orden, tipoDeOrden, subRegion, temporada]);

  useEffect(() => {
    setOrden(null);
    setTipoDeOrden(null);
    setSubRegion("");
    setTemporada("");
    dispatch(cambioDePagina(1));
  }, [parametroDeBusqueda, dispatch]);

  useEffect(() => {
    let paramsSearch = `pagina=${paginaActual}`;
    if (!!orden && !!tipoDeOrden) {
      paramsSearch += `&orden=${orden}&tipoDeOrden=${tipoDeOrden}`;
    }
    if (!!subRegion) {
      paramsSearch += `&subRegion=${subRegion}`;
    }
    if (!!temporada) {
      paramsSearch += `&temporada=${temporada}`;
    }
    if (!!parametroDeBusqueda) {
      dispatch(searchCountry(`${parametroDeBusqueda}&${paramsSearch}`));
    } else {
      dispatch(getAllCountries(`?${paramsSearch}`));
    }
  }, [
    dispatch,
    parametroDeBusqueda,
    orden,
    tipoDeOrden,
    subRegion,
    temporada,
    paginaActual,
  ]);

  const changePage = (pagina) => {
    dispatch(cambioDePagina(pagina));
  };

  const resetFiltros = () => {
    setOrden(null);
    setTipoDeOrden(null);
    setSubRegion("");
    setTemporada("");
  };

  return (
    <div className="cardDetailCatalogo">
      <div className="cardBoxConten">
        {dataCountry?.rows?.map((country) => {
          return <Card key={country.id} props={country} />;
        })}
        {!dataCountry.count && (
          <div>
            <Error />
          </div>
        )}
      </div>
      <div className="boxButtonPage">
        {paginado?.map((page) => {
          return (
            <button
              id="PaginaActual"
              onClick={() => changePage(page)}
              style={{
                color: ` ${page === paginaActual ? "#fff" : "#000"}`,
              }}
            >
              {page}
            </button>
          );
        })}
      </div>
      <div className="boxButtonFilter">
        <button onClick={() => resetFiltros()} className="bottonFiltro">
          reset filtros
        </button>
        <button
          onClick={() => setOrden("asc")}
          className={`${orden === "asc" ? "filterSelect" : "bottonFiltro"}`}
        >
          Ascendente ⇧
        </button>
        <button
          onClick={() => setOrden("desc")}
          className={`${orden === "desc" ? "filterSelect" : "bottonFiltro"}`}
        >
          Descendente ⇩
        </button>

        <button
          onClick={() => setTipoDeOrden("population")}
          className={`${
            tipoDeOrden === "population" ? "filterSelect" : "bottonFiltro"
          }`}
        >
          Poblacion
        </button>
        <button
          onClick={() => setTipoDeOrden("name")}
          className={`${
            tipoDeOrden === "name" ? "filterSelect" : "bottonFiltro"
          }`}
        >
          Nombre
        </button>
      </div>
      <select
        id="continentes"
        name="continentes"
        value={subRegion}
        onChange={(e) => setSubRegion(e.target.value)}
      >
        <option id="opcContienente" value=""></option>
        {subRegiones.map((subRegion) => {
          return (
            <option id="opcContienente" value={subRegion}>
              {subRegion}
            </option>
          );
        })}
      </select>
      <select
        id="temporadaC"
        name="season"
        value={temporada}
        onChange={(e) => setTemporada(e.target.value)}
      >
        <option id="opcTemporada" value=""></option>
        <option id="opcTemporada" value="verano">
          Verano
        </option>
        <option id="opcTemporada" value="otoño">
          Otoño
        </option>
        <option id="opcTemporada" value="invierno">
          Invierno
        </option>
        <option id="opcTemporada" value="primavera">
          Primavera
        </option>
      </select>
    </div>
  );
};

export default Catalogue;
