import AfriTradingProviderRegistry from "./AfriTradingProviderRegistry.js";
import FinnhubProvider from "./FinnhubProvider.js";
import AlphaVantageProvider from "./AlphaVantageProvider.js";
import TwelveDataProvider from "./TwelveDataProvider.js";
import CoinGeckoProvider from "./CoinGeckoProvider.js";
import AfriTradingSimulationProvider from "./AfriTradingSimulationProvider.js";

if (!AfriTradingProviderRegistry.get(FinnhubProvider.name)) {
  AfriTradingProviderRegistry.register(FinnhubProvider.name, FinnhubProvider);
}

if (!AfriTradingProviderRegistry.get(AlphaVantageProvider.name)) {
  AfriTradingProviderRegistry.register(AlphaVantageProvider.name, AlphaVantageProvider);
}

if (!AfriTradingProviderRegistry.get(TwelveDataProvider.name)) {
  AfriTradingProviderRegistry.register(TwelveDataProvider.name, TwelveDataProvider);
}

if (!AfriTradingProviderRegistry.get(CoinGeckoProvider.name)) {
  AfriTradingProviderRegistry.register(
    CoinGeckoProvider.name,
    CoinGeckoProvider
  );
}

if (!AfriTradingProviderRegistry.get(AfriTradingSimulationProvider.name)) {
  AfriTradingProviderRegistry.register(
    AfriTradingSimulationProvider.name,
    AfriTradingSimulationProvider
  );
}

export default AfriTradingProviderRegistry;
