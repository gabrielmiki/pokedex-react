import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, Image } from "react-native";


interface PokemonDetails {
    id: number;
    name: string;
    height: number;
    weight: number;
    sprites: {
        front_default: string;
    };
    types: Array<{
        type: {
            name: string;
        };
    }>;
    stats: Array<{
        stat: {
            name: string;
        };
        base_stat: number;
    }>;
}

export default function Details() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const pokemonId = (params.id as string) || '1';
    const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPokemon = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
                const data = await response.json();
                setPokemon(data);
            } catch (error) {
                console.error('Failed to fetch pokemon:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
    }, [pokemonId]);
    
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

    // PokeAPI returns height in decimeters and weight in hectograms
    function formatHeight(heightDecimeters: number) {
      const meters = heightDecimeters / 10;
      const feet = Math.floor(meters * 3.28084);
      const inches = Math.round((meters * 3.28084 - feet) * 12);
      return `${meters.toFixed(1)}m (${feet}'${inches}")`;
    }
    
    function formatWeight(weightHectograms: number) {
      const kg = weightHectograms / 10;
      const lbs = Math.round(kg * 2.20462);
      return `${kg.toFixed(1)}kg (${lbs}lbs)`;
    }

    if (loading) return <View style={{ padding: 32 }}><Text>Loading...</Text></View>;
    if (!pokemon) return <View style={{ padding: 32 }}><Text>Pokemon not found</Text></View>;

    return (
        <View>
            <View style={{ alignItems: 'center', ...styles.cardStyle }}>
                <Text style={styles.pokemonName}>{pokemon.name}</Text>
                <Text style={{ backgroundColor: getTypeColor(pokemon.types[0].type.name) + 50, ...styles.typeText }}>{pokemon.types[0].type.name}</Text>
                <Image source={{ uri: pokemon.sprites.front_default }} style={styles.pokemonImage} />
                    
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15, paddingHorizontal: 20 }}>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Height</Text>
                    <Text style={styles.statValue}>{formatHeight(pokemon.height)}</Text>
                  </View>
                  <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Weight</Text>
                    <Text style={styles.statValue}>{formatWeight(pokemon.weight)}</Text>
                  </View>
                </View>                
                <View style={{ width: '100%', marginTop: 10 }}>
                  {pokemon.stats.map((stat) => (
                    <View key={stat.stat.name}>
                      <Text>{stat.stat.name}: {stat.base_stat}</Text>
                      <View style={{ height: 8, backgroundColor: '#ddd', borderRadius: 4, marginVertical: 5 }}>
                        <View style={{ height: 8, backgroundColor: '#4CAF50', width: `${(stat.base_stat / 255) * 100}%`, borderRadius: 4 }} />
                      </View>
                    </View>
                  ))}
                </View>
            </View>
        </View>
    );
}

// Using StyleSheet to create a style for the pokemon cards, and use it in the render method.
// First we will create a style for the pokemon text name, and then we will create a style for the pokemon type text, and then we will create a style for the pokemon image.

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
    elevation: 5
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
    width: 200,
    height: 200,
    alignSelf: "center",
  },
    statBox: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    minWidth: 120,
    },
    statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
    fontWeight: '600',
    },
    statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    },
});