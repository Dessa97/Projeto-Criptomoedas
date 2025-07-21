import styles from "../home/home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useEffect, useState } from "react";

export interface CoinProps {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp {
  data: CoinProps[];
}

export function Home() {
  /*input: controla o valor digitado no campo de pesquisa.*/
  const [input, setInput] = useState("");
  /*coins: armazena os dados das moedas.*/
  const [coins, setCoins] = useState<CoinProps[]>([]);
  /*navigate é uma função que permite fazer navegação programática para outras rotas da aplicação (por exemplo, navigate("/home")). */
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);

  /*O useEffect com [] roda uma única vez após o componente montar, chamando a função getData ao carregar a página. */
  useEffect(() => {
    getData();
  }, [offset]);

  async function getData() {
    fetch(
      `https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=336311ba614f0f89b8ba2a52a22576bd47b374bf63d423f8df7359e03a0a4481`
    )
      .then((response) => response.json())
      .then((data: DataProp) => {
        const coinsData = data.data;
        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });
        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };
          return formated;
        });
        const listCoins = [...coins, ...formatedResult];
        setCoins(listCoins);
      });
  }

  /*e: Evento de envio do formulário.
  FormEvent: Tipagem do evento de formulário (usado com TypeScript).*/
  function handleSubmit(e: FormEvent) {
    /*e.preventDefault(): Evita que o navegador recarregue a página ao enviar o formulário.*/
    e.preventDefault();
    if (input === "") return;
    navigate(`/detail/${input}`);
  }

  function handleGetMore() {
    if (offset === 0) {
      setOffset(10);
      return;
    }
    setOffset(offset + 10);
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda... Ex: bitcoin"
          /*useState */
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>
      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor Mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança 24h</th>
          </tr>
        </thead>
        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              <tr className={styles.tr} key={item.id}>
                <td className={styles.tdlabel} data-label="Moeda">
                  <div className={styles.name}>
                    <img
                      className={styles.logo}
                      alt="Logo Cripto"
                      src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                    />
                    <Link to={`/detail/${item.id}`}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>
                <td className={styles.tdlabel} data-label="Valor Mercado">
                  {item.formatedMarket}
                </td>
                <td className={styles.tdlabel} data-label="Preço">
                  {item.formatedPrice}
                </td>
                <td className={styles.tdlabel} data-label="Volume">
                  {item.formatedVolume}
                </td>
                <td
                  className={
                    Number(item.changePercent24Hr) > 0
                      ? styles.tdProfit
                      : styles.tdLoss
                  }
                  data-label="Mudança 24h"
                >
                  <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
