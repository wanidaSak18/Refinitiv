import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import * as React from "react";

//Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

//Input
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

function createData(id: number, num: number, cal: string, prime: boolean) {
  return { id, num, cal, prime };
}

const rows = [createData(1, 1, "isPrime", true)];

const calculations = [
  {
    value: "isPrime",
    label: "isPrime",
  },
  {
    value: "isFibonacci",
    label: "isFibonacci",
  },
];

const categoryData: Array<string> = [];

const Home: NextPage = () => {
  //Question 1
  const [isMatch, setIsMatch] = React.useState(false);
  const [num, setNum] = React.useState("");
  const [type, setType] = React.useState("isPrime");

  //Question 2
  const [catData, setCat] = React.useState(categoryData); //transection data
  const [categoriesData, setCategories] = React.useState(categoryData); //orignal data
  const [isLoading, setLoading] = React.useState(false);

  //#region Question 1
  const changeNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Set Num: ", Math.round(Number(event.target.value)));
    const number = Math.round(Number(event.target.value ?? 0));
    console.log("Set Num: ", number);
    setNum(String(number));
    setIsMatch(isMatched(number, type));
  };
  const changeType = (event: SelectChangeEvent) => {
    setType(event.target.value);
    setIsMatch(isMatched(Number(num), event.target.value));
  };

  const isPrime = (n: number) => {
    if (n <= 1) return false;
    if (n === 2) return true;
    for (let i = 2; i < n; i++) {
      if (n % i === 0) {
        console.log("is not prime");
        return false;
      }
    }
    console.log("is prime");
    return true;
  };

  const isPerfectSquare = (n: number) => {
    let s = Number(Math.sqrt(n));
    return s * s == n;
  };

  const isFibonacci = (n: number) => {
    // n is Fibonacci if one of 5*n*n + 4 or 5*n*n - 4 or both
    // is a perfect square
    console.log(
      "is isFibonacci?: ",
      isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4)
    );
    return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
  };

  const isMatched = (num: number, type: string) => {
    console.log("Number:", num);
    console.log("Type:", type);
    if (type == "isPrime") return isPrime(num);
    if (type == "isFibonacci") return isFibonacci(num);
    console.log("isPrime", isPrime(num));
    console.log("isFibonacci", isFibonacci(num));
    return false;
  };
  //#endregion

  //#region Question 2
  React.useEffect(() => {
    setLoading(true);
    fetch("https://api.publicapis.org/categories")
      .then((res) => res.json())
      .then((data) => {
        console.log("Set Category Data");
        setCat(data.categories);
        setCategories(data.categories);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (!catData) return <p>No profile data</p>;

  const changeCategory = (event: React.ChangeEvent<HTMLInputElement>) => {
    let filterData = categoriesData;
    if(event.target.value) filterData = filterData.filter((name => name.startsWith(event.target.value)))
    setCat(filterData);
  };
  //#endregion


  return (
    <div className={styles.container}>
      <Head>
        <title>Refinitiv Test</title>
        <meta name="description" content="Refinitiv Front-End Test" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Test</h1>

        <p className={styles.description}>Question 1</p>

        <div className={styles.grid}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "200px" }}>Number</TableCell>
                  <TableCell min-width="100px" align="right">
                    Number Type
                  </TableCell>
                  <TableCell width="300px" align="right">
                    Matched
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ width: "200px" }}
                    >
                      <TextField
                        type="number"
                        id="number-basic"
                        label="Number"
                        variant="standard"
                        value={num}
                        InputProps={{ inputProps: { min: 0 } }}
                        onChange={changeNumber}
                      />
                    </TableCell>
                    <TableCell min-width="100px" align="right">
                      <FormControl
                        variant="filled"
                        sx={{ m: 1, minWidth: 100 }}
                      >
                        <InputLabel id="demo-simple-select-filled-label">
                          Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-filled-label"
                          id="demo-simple-select-filled"
                          value={type}
                          onChange={changeType}
                          fullWidth={true}
                        >
                          {calculations.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell width="300px" align="right">
                      {String(isMatch)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <p className={styles.description}>Question 2</p>
        <div className={styles.grid}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "200px" }}>
                    <TextField
                      id="filled-basic"
                      label="Category Name"
                      variant="filled"
                      onChange={changeCategory}
                    />
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {catData.map((row: string) => (
                  <TableRow
                    key={row}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{row}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
};

export default Home;
