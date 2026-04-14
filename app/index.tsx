import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// Pokemon type 
interface Pokemon {
  name: string;
  url: string;
  front_default: string;
  back_default: string;
  type: string;
}

export default function Index() {

  // This is the main screen of the app, it will show a list of pokemon in a grid layout. 
  // Each pokemon will have a card with its name and image, and a button to navigate to the details screen for that pokemon. 
  // The background color of the cards should be the color of the pokemon type.

  // useState to store the pokemon data from the pokeapi.
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Create animated values for each image
  // Use useRef instead of useState for persistent animation values
  const bobValue = useRef(new Animated.Value(0)).current;
  const [flipValue] = useState(new Animated.Value(0));

  // useeffect to fetch the pokemon data from the pokeapi and store it in a state variable.
  useEffect(() => {
    // fetch the pokemon data from the pokeapi and store it in a state variable.
    fetchPokemonData(50, 0);
  }, []);
  
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  // Function to start animation
  const startAnimation = () => {
    // Stop previous animation if it exists
    animationRef.current?.stop();
    
    // Reset the value
    bobValue.setValue(0);
    
    // Start new animation
    animationRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(bobValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(bobValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    
    animationRef.current.start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  // function to fecth the pokemon data from the pokeapi and store it in a state variable.
  async function fetchPokemonData(length: number, offset: number) {
    // fetch the pokemon data from the pokeapi and store it in a state variable.
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${length}&offset=${offset}`);
      const data = await response.json();

      // For each pokemon in the data, we need to fetch the pokemon details from the pokeapi 
      // and store it in a state variable.
      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon: Pokemon) => {
          const response = await fetch(pokemon.url);
          const details = await response.json();
          return {
            name: pokemon.name,
            url: pokemon.url,
            front_default: details.sprites.front_default,
            back_default: details.sprites.back_default,
            type: details.types[0].type.name,
          }
        })
      );

      setPokemonData(pokemonDetails);
      startAnimation();
    } catch (error) {
      console.error(error);
    }
  }

  function getTypeColor(type: string) {
    const colorMap: { [key: string]: string } = {
      grass: "rgba(76, 175, 80, 0.85)",      // vibrant green
      fire: "rgba(255, 87, 34, 0.85)",       // deep orange-red
      water: "rgba(33, 150, 243, 0.85)",     // bright blue
      electric: "rgba(255, 193, 7, 0.85)",   // golden yellow
      psychic: "rgba(156, 39, 176, 0.85)",   // rich purple
      ice: "rgba(0, 188, 212, 0.85)",        // cyan
      dragon: "rgba(103, 58, 183, 0.85)",    // deep indigo
      dark: "rgba(66, 66, 66, 0.9)",         // charcoal
      fairy: "rgba(233, 30, 99, 0.85)",      // magenta-pink
    };
    
    return colorMap[type] || "rgba(158, 158, 158, 0.85)"; // default gray
  }

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPokemon = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pokemon.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
<View style={{ flex: 1, width: '90%', alignSelf: 'center' }}>
  <TextInput
    placeholder="Search by name or type..."
    value={searchQuery}
    onChangeText={setSearchQuery}
    style={{
      margin: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
    }}
  />
  
  <FlatList
    style={{ width: '100%' }} // Ensures the list fills the 90% parent
    data={filteredPokemon}
    keyExtractor={(pokemon) => pokemon.name}
    numColumns={2}
    extraData={currentPage}
    // Cleaned up container style: no width or align settings here
    contentContainerStyle={{ paddingBottom: 20 }} 
    // Handles spacing between columns
    columnWrapperStyle={{ gap: 8 }} 
    // Handles spacing between rows
    ItemSeparatorComponent={() => <View style={{ height: 8 }} />} 
    renderItem={({ item: pokemon }) => (
        <Pressable
          onPress={() => {
            router.push({ pathname: "/details", params: { id: pokemon.url.split("/").slice(-2, -1)[0] } });
          }}
          style={({ pressed, hovered }) => ({
            flex: 1, // Divides row space equally among the 6 cards
            // maxWidth: '15.5%', // Prevents stretching if a row has fewer than 6 items
            backgroundColor: getTypeColor(pokemon.type),
            ...styles.cardStyle, // Ensure no fixed width is in here!
            opacity: pressed ? 0.6 : hovered ? 0.95 : 1,
            transform: [{ scale: pressed ? 0.92 : hovered ? 1.08 : 1 }],
            borderWidth: pressed ? 3 : hovered ? 2 : 0,
            borderColor: pressed ? "#000" : hovered ? "#fff" : "transparent",
          })}
        >
          <Text style={styles.pokemonName} numberOfLines={1}>
            {pokemon.name}
          </Text>
          <Text style={{ backgroundColor: getTypeColor(pokemon.type), ...styles.typeText }}>
            {pokemon.type}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Animated.Image
              source={{ uri: pokemon.front_default }}
              style={{
                ...styles.pokemonImage,
                transform: [
                  {
                    translateY: bobValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -10],
                    }),
                  },
                ],
              }}
            />
          </View>
        </Pressable>
    )}
    ListFooterComponent={
      <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginVertical: 20, paddingHorizontal: 10 }}>
        {[1, 2, 3, 4, 5].map((page) => (
          <Pressable
            key={page}
            onPress={() => {
              fetchPokemonData(50, (page - 1) * 50);
              setCurrentPage(page);
              startAnimation();
            }}
            style={({ pressed, hovered }) => ({
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginHorizontal: 5,
              marginVertical: 5,
              backgroundColor: currentPage === page ? "#005BB5" : pressed ? "#005BB5" : "#007AFF",
              borderRadius: 8,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            })}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>{page}</Text>
          </Pressable>
        ))}
      </View>
    }
  />
</View>
  );
}

// Use StyleSheet to create a style for the pokemon cards, and use it in the render method.
// First we will create a style for the pokemon text name
const styles = StyleSheet.create({
  cardStyle: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignContent: "center",
  },
  pokemonName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  typeText: {
    textAlign: "center",
    marginBottom: 10,
    color: "white",
    paddingHorizontal: 8,
    borderRadius: 5,
    alignSelf: "center",
  },
  pokemonImage: {
    width: 100,
    height: 100,
    alignSelf: "center",
  },
});