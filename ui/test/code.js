
const a = {
  a: 1,
  b: 2,
  c: {
    d: 3
  }
}

const AppX = (props, children) => {

  //console.log(React)
  //console.log(React.default)

  const routeResult = useRoutes(routes)

  return (
    <Provider$1 store={store}>
    </Provider$1>
  )
}

export default AppX;

/*
<ThemeProvider theme={theme}>
  <GlobalStyles />
   {routeResult || <HeaderLayout><NotFoundView/></HeaderLayout>}
</ThemeProvider>
*/
