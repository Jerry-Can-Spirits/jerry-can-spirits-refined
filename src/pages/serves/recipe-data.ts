// src/pages/serves/recipe-data.ts

export interface Ingredient {
  amount: string;
  item: string;
  note?: string;
}

export interface Recipe {
  slug: string; // The required property for URLs
  name: string;
  tagline: string;
  description: string;
  spirit: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  prepTime: string;
  servings: string;
  glassware: string;
  ingredients: Ingredient[];
  instructions: string[];
  garnish?: string;
  tips?: string[];
  image: string;
  imageAlt: string;
}

// 1. Quartermaster's Old Fashioned
export const quartermastersOldFashioned: Recipe = {
  slug: "quartermasters-old-fashioned",
  name: "Quartermaster's Old Fashioned",
  tagline: "A timeless classic, reimagined",
  description: "The Old Fashioned is the foundation of cocktail culture. Our version honours tradition while showcasing the depth of The Quartermaster's Reserve.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Easy",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Rocks glass",
  ingredients: [ { amount: "60ml", item: "The Quartermaster's Reserve" }, { amount: "1 tsp", item: "Demerara sugar syrup" }, { amount: "2 dashes", item: "Angostura bitters" }, { amount: "1 dash", item: "Orange bitters", note: "optional" } ],
  instructions: [ "Add the sugar syrup and bitters to a rocks glass.", "Add The Quartermaster's Reserve and fill the glass with large ice cubes.", "Stir gently for 20-30 seconds to chill and dilute.", "Express the oils from an orange peel over the drink.", "Garnish with the orange peel." ],
  garnish: "Orange peel",
  tips: [ "Use large ice cubes to minimize dilution.", "Demerara syrup adds depth - make it 2:1 sugar to water.", "The quality of your bitters matters - invest in good ones." ],
  image: "/images/cocktails/old-fashioned.jpg",
  imageAlt: "A Quartermaster's Old Fashioned cocktail on a dark wooden surface."
};

// 2. Night Watch Negroni
export const nightWatchNegroni: Recipe = {
  slug: "night-watch-negroni",
  name: "Night Watch Negroni",
  tagline: "Bold, bitter, and beautifully balanced",
  description: "A sophisticated evening companion. The Quartermaster's Reserve brings depth to this Italian classic, perfect for contemplative moments as the sun sets.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Medium",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Rocks glass or coupe",
  ingredients: [ { amount: "30ml", item: "The Quartermaster's Reserve" }, { amount: "30ml", item: "Campari" }, { amount: "30ml", item: "Sweet vermouth" }, { amount: "1", item: "Large ice cube", note: "for serving" } ],
  instructions: [ "Add all ingredients to a mixing glass filled with ice.", "Stir for 30 seconds until well chilled.", "Strain into a rocks glass over a large ice cube.", "Express orange oils over the surface.", "Garnish with an orange wheel or peel." ],
  garnish: "Orange wheel",
  tips: [ "Equal parts is traditional, but adjust to taste.", "Try different vermouths for variation - Cocchi di Torino works beautifully.", "For a lighter version, top with prosecco for a Negroni Sbagliato." ],
  image: "/images/cocktails/negroni.jpg",
  imageAlt: "Night Watch Negroni with orange garnish in crystal glass."
};

// 3. Reconnaissance Refresher
export const reconnaissanceRefresher: Recipe = {
  slug: "reconnaissance-refresher",
  name: "Reconnaissance Refresher",
  tagline: "Light, bright, and ready for action",
  description: "A daytime essential for warm weather operations. Expedition Spiced adds complexity to this refreshing highball that keeps you sharp.",
  spirit: "Expedition Spiced",
  difficulty: "Easy",
  prepTime: "3 minutes",
  servings: "1 cocktail",
  glassware: "Highball glass",
  ingredients: [ { amount: "50ml", item: "Expedition Spiced" }, { amount: "15ml", item: "Fresh lime juice" }, { amount: "10ml", item: "Simple syrup" }, { amount: "Top", item: "Ginger beer" }, { amount: "6-8", item: "Fresh mint leaves" }, { amount: "Cubed", item: "Ice" } ],
  instructions: [ "Gently muddle mint leaves in the bottom of a highball glass.", "Fill glass with ice.", "Add Expedition Spiced, lime juice, and simple syrup.", "Top with ginger beer and stir gently.", "Garnish with a mint sprig and lime wheel." ],
  garnish: "Mint sprig and lime wheel",
  tips: [ "Don't over-muddle the mint - you want to release oils, not pulverize.", "Use a spicy ginger beer for extra kick.", "Add a dash of Angostura bitters for complexity." ],
  image: "/images/cocktails/refresher.jpg",
  imageAlt: "Reconnaissance Refresher garnished with fresh mint in tall glass."
};

// 4. Expedition Mule
export const expeditionMule: Recipe = {
  slug: "expedition-mule",
  name: "Expedition Mule",
  tagline: "A spiced journey in a copper mug",
  description: "Our take on the Moscow Mule showcases Expedition Spiced's warming notes. The perfect companion for any adventure, served ice-cold in traditional copper.",
  spirit: "Expedition Spiced",
  difficulty: "Easy",
  prepTime: "3 minutes",
  servings: "1 cocktail",
  glassware: "Copper mug or highball glass",
  ingredients: [ { amount: "60ml", item: "Expedition Spiced" }, { amount: "20ml", item: "Fresh lime juice" }, { amount: "150ml", item: "Ginger beer" }, { amount: "2 dashes", item: "Angostura bitters", note: "optional" }, { amount: "Crushed", item: "Ice" } ],
  instructions: [ "Fill a copper mug with crushed ice.", "Add Expedition Spiced and lime juice.", "Top with ginger beer.", "Add bitters if using and stir gently.", "Garnish with a lime wedge and candied ginger." ],
  garnish: "Lime wedge and candied ginger",
  tips: [ "The copper mug isn't just tradition - it keeps the drink colder.", "Make it a 'Dark & Stormy' variation by floating 10ml of dark rum on top.", "Fresh ginger slices muddled in the mug add extra spice." ],
  image: "/images/cocktails/expedition-mule.jpg",
  imageAlt: "Expedition Mule in copper mug with lime garnish."
};

// 5. Campfire Punch (Batch Cocktail)
export const campfirePunch: Recipe = {
  slug: "campfire-punch",
  name: "Campfire Punch",
  tagline: "Stories are better when shared",
  description: "A warming batch cocktail designed for sharing. Perfect for gatherings around the fire, this punch brings people together with its comforting spice and citrus notes.",
  spirit: "Expedition Spiced & The Quartermaster's Reserve",
  difficulty: "Medium",
  prepTime: "15 minutes",
  servings: "8-10 servings",
  glassware: "Punch bowl and punch cups",
  ingredients: [ { amount: "400ml", item: "Expedition Spiced" }, { amount: "200ml", item: "The Quartermaster's Reserve" }, { amount: "300ml", item: "Apple cider" }, { amount: "200ml", item: "Fresh lemon juice" }, { amount: "150ml", item: "Honey syrup", note: "2:1 honey to water" }, { amount: "500ml", item: "Hot water" }, { amount: "2", item: "Cinnamon sticks" }, { amount: "3", item: "Star anise" }, { amount: "1", item: "Orange, sliced into wheels" }, { amount: "1", item: "Apple, sliced" } ],
  instructions: [ "In a large pot, gently warm (don't boil) the apple cider with cinnamon and star anise for 10 minutes.", "Add both rums, lemon juice, and honey syrup.", "Add hot water to desired strength.", "Transfer to a punch bowl and add fruit slices.", "Serve warm in punch cups with a cinnamon stick stirrer." ],
  garnish: "Cinnamon stick and apple slice",
  tips: [ "Can be made cold - use cold apple cider and add ice.", "For individual servings, scale down proportionally.", "Add a splash of Allspice Dram for extra Caribbean warmth." ],
  image: "/images/cocktails/campfire-punch.jpg",
  imageAlt: "Campfire Punch in a rustic bowl with floating fruit and spices."
};

// 6. Jerry Can Julep
export const jerryCanJulep: Recipe = {
  slug: "jerry-can-julep",
  name: "Jerry Can Julep",
  tagline: "Southern charm meets British ingenuity",
  description: "A refreshing twist on the Kentucky classic. The Quartermaster's Reserve provides a robust foundation for this mint-forward cooler, perfect for summer expeditions.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Advanced",
  prepTime: "7 minutes",
  servings: "1 cocktail",
  glassware: "Julep cup or rocks glass",
  ingredients: [ { amount: "75ml", item: "The Quartermaster's Reserve" }, { amount: "15ml", item: "Demerara syrup" }, { amount: "10-12", item: "Fresh mint leaves", note: "plus sprigs for garnish" }, { amount: "Crushed", item: "Ice" } ],
  instructions: [ "Gently muddle mint leaves with syrup in the bottom of a julep cup.", "Add half the crushed ice and stir.", "Add The Quartermaster's Reserve and stir again.", "Pack the cup with more crushed ice, mounding it above the rim.", "Stir until the cup frosts (about 30 seconds).", "Top with more crushed ice and garnish with a bouquet of mint.", "Add a straw cut to just above the mint." ],
  garnish: "Bouquet of fresh mint and powdered sugar dusting",
  tips: [ "The key is CRUSHED ice - it dilutes perfectly and frosts the cup.", "Slap the mint between your hands before garnishing to release oils.", "A dash of Jamaican rum floated on top adds complexity." ],
  image: "/images/cocktails/jerry-can-julep.jpg",
  imageAlt: "Jerry Can Julep in frosted silver cup with abundant mint garnish."
};

// 7. The Navigator's Sour
export const navigatorsSour: Recipe = {
  slug: "navigators-sour",
  name: "The Navigator's Sour",
  tagline: "Chart your course with citrus",
  description: "A perfectly balanced sour that showcases the versatility of Expedition Spiced. The egg white creates a silky texture that carries the spice notes beautifully.",
  spirit: "Expedition Spiced",
  difficulty: "Medium",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Coupe or Nick & Nora glass",
  ingredients: [ { amount: "60ml", item: "Expedition Spiced" }, { amount: "25ml", item: "Fresh lemon juice" }, { amount: "20ml", item: "Simple syrup" }, { amount: "1", item: "Egg white", note: "or 25ml aquafaba" }, { amount: "2 dashes", item: "Angostura bitters", note: "for garnish" } ],
  instructions: [ "Add all ingredients except bitters to a shaker without ice.", "Dry shake vigorously for 15 seconds.", "Add ice and shake again for 15 seconds.", "Double strain into a chilled coupe glass.", "Express lemon oils over the foam.", "Create a design with the bitters on the foam." ],
  garnish: "Angostura bitters art on foam",
  tips: [ "The dry shake is crucial for proper foam formation.", "For a Boston Sour variation, add 15ml of red wine float.", "Dehydrated lemon wheel makes an elegant garnish." ],
  image: "/images/cocktails/navigators-sour.jpg",
  imageAlt: "Navigator's Sour with decorative bitters design on white foam."
};

// 8. Base Camp Boulevardier
export const baseCampBoulevardier: Recipe = {
  slug: "base-camp-boulevardier",
  name: "Base Camp Boulevardier",
  tagline: "Shelter from the storm",
  description: "A warming stirred cocktail that's perfect for cold nights. The Quartermaster's Reserve stands up beautifully to the bitter Campari and sweet vermouth.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Easy",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Rocks glass or coupe",
  ingredients: [ { amount: "45ml", item: "The Quartermaster's Reserve" }, { amount: "30ml", item: "Campari" }, { amount: "30ml", item: "Sweet vermouth" }, { amount: "1", item: "Large ice cube" } ],
  instructions: [ "Add all ingredients to a mixing glass with ice.", "Stir for 30-40 seconds until well chilled.", "Strain into a rocks glass over a large ice cube.", "Express orange oils over the surface.", "Garnish with an orange peel." ],
  garnish: "Orange peel",
  tips: [ "Try different rum/Campari/vermouth ratios to find your preference.", "Smoking the glass with applewood adds complexity.", "A bar spoon of maraschino liqueur adds depth." ],
  image: "/images/cocktails/base-camp-boulevardier.jpg",
  imageAlt: "Base Camp Boulevardier in rocks glass with orange twist."
};

// 9. Summit Spritz
export const summitSpritz: Recipe = {
  slug: "summit-spritz",
  name: "Summit Spritz",
  tagline: "Celebration at altitude",
  description: "A sparkling aperitif that combines Expedition Spiced with prosecco for a refreshing celebration drink. Light enough for afternoon adventures.",
  spirit: "Expedition Spiced",
  difficulty: "Easy",
  prepTime: "3 minutes",
  servings: "1 cocktail",
  glassware: "Large wine glass",
  ingredients: [ { amount: "30ml", item: "Expedition Spiced" }, { amount: "20ml", item: "Aperol" }, { amount: "90ml", item: "Prosecco" }, { amount: "Splash", item: "Soda water" }, { amount: "Cubed", item: "Ice" } ],
  instructions: [ "Fill a large wine glass with ice.", "Add Expedition Spiced and Aperol.", "Top with prosecco and a splash of soda.", "Stir gently to combine.", "Garnish with an orange slice and fresh herbs." ],
  garnish: "Orange slice and rosemary sprig",
  tips: [ "Build in the glass to preserve the bubbles.", "Swap Aperol for Campari for a more bitter profile.", "Frozen grapes keep it cold without dilution." ],
  image: "/images/cocktails/summit-spritz.jpg",
  imageAlt: "Summit Spritz in wine glass with orange and herbs."
};

// 10. The Watch Commander
export const watchCommander: Recipe = {
  slug: "watch-commander",
  name: "The Watch Commander",
  tagline: "Stay sharp through the night",
  description: "An espresso-forward cocktail that combines The Quartermaster's Reserve with cold brew for those long watches. Bold, complex, and invigorating.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Medium",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Coupe or martini glass",
  ingredients: [ { amount: "45ml", item: "The Quartermaster's Reserve" }, { amount: "30ml", item: "Cold brew concentrate" }, { amount: "15ml", item: "Coffee liqueur" }, { amount: "10ml", item: "Demerara syrup" }, { amount: "2 dashes", item: "Chocolate bitters", note: "optional" } ],
  instructions: [ "Add all ingredients to a shaker with ice.", "Shake vigorously for 15 seconds.", "Double strain into a chilled coupe glass.", "Float 3 coffee beans on top for garnish." ],
  garnish: "3 coffee beans",
  tips: [ "Quality cold brew makes all the difference.", "Add 15ml of cream for a richer texture.", "Rim with cocoa and sea salt for extra complexity." ],
  image: "/images/cocktails/watch-commander.jpg",
  imageAlt: "Watch Commander cocktail with three coffee beans floating on top."
};

// 11. Trailblazer's Toddy
export const trailblazersToddy: Recipe = {
  slug: "trailblazers-toddy",
  name: "Trailblazer's Toddy",
  tagline: "Warmth for the weary wanderer",
  description: "A comforting hot cocktail that's perfect for cold nights under the stars. The Quartermaster's Reserve provides a rich base for this honey-sweetened warmer.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Easy",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Heat-proof mug",
  ingredients: [ { amount: "60ml", item: "The Quartermaster's Reserve" }, { amount: "15ml", item: "Honey" }, { amount: "15ml", item: "Fresh lemon juice" }, { amount: "120ml", item: "Hot water" }, { amount: "1", item: "Cinnamon stick" }, { amount: "2", item: "Cloves" }, { amount: "1", item: "Lemon wheel" } ],
  instructions: [ "Add honey to a heat-proof mug.", "Add lemon juice and a splash of hot water, stir to dissolve honey.", "Add The Quartermaster's Reserve.", "Top with remaining hot water.", "Garnish with lemon wheel studded with cloves and add cinnamon stick." ],
  garnish: "Clove-studded lemon wheel and cinnamon stick",
  tips: [ "Don't use boiling water - around 70°C is perfect.", "Try different honeys for varied flavour profiles.", "A pat of butter adds richness (seriously!)." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Trailblazer's Toddy in a rustic mug with steam rising."
};

// 12. Compass Rose Collins
export const compassRoseCollins: Recipe = {
  slug: "compass-rose-collins",
  name: "Compass Rose Collins",
  tagline: "Find your true north",
  description: "A refreshing long drink that points you in the right direction. Expedition Spiced adds complexity to this classic Tom Collins variation.",
  spirit: "Expedition Spiced",
  difficulty: "Easy",
  prepTime: "3 minutes",
  servings: "1 cocktail",
  glassware: "Collins glass",
  ingredients: [ { amount: "50ml", item: "Expedition Spiced" }, { amount: "25ml", item: "Fresh lemon juice" }, { amount: "15ml", item: "Simple syrup" }, { amount: "Top", item: "Soda water" }, { amount: "Cubed", item: "Ice" } ],
  instructions: [ "Fill a Collins glass with ice.", "Add Expedition Spiced, lemon juice, and simple syrup.", "Stir briefly to combine.", "Top with soda water.", "Garnish with a lemon wheel and cherry." ],
  garnish: "Lemon wheel and maraschino cherry",
  tips: [ "Use superfine sugar instead of syrup for a more traditional approach.", "Add fresh berries for a seasonal twist.", "A sprig of thyme adds aromatic complexity." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Compass Rose Collins in tall glass with citrus garnish."
};

// 13. Field Rations Flip
export const fieldRationsFlip: Recipe = {
  slug: "field-rations-flip",
  name: "Field Rations Flip",
  tagline: "Sustenance in a glass",
  description: "A rich, creamy cocktail that's almost a meal in itself. This whole egg cocktail showcases The Quartermaster's Reserve in a velvety, indulgent format.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Advanced",
  prepTime: "7 minutes",
  servings: "1 cocktail",
  glassware: "Coupe or wine glass",
  ingredients: [ { amount: "60ml", item: "The Quartermaster's Reserve" }, { amount: "30ml", item: "Tawny port" }, { amount: "15ml", item: "Demerara syrup" }, { amount: "1", item: "Whole egg" }, { amount: "Grated", item: "Fresh nutmeg", note: "for garnish" } ],
  instructions: [ "Add all ingredients except nutmeg to a shaker without ice.", "Dry shake very vigorously for 20 seconds.", "Add ice and shake again for 15 seconds.", "Double strain into a chilled coupe.", "Garnish with freshly grated nutmeg." ],
  garnish: "Freshly grated nutmeg",
  tips: [ "Room temperature egg emulsifies better.", "The dry shake is crucial - really go for it!", "Try with sherry instead of port for variation." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Field Rations Flip with nutmeg dusting in coupe glass."
};

// 14. Monsoon Mai Tai
export const monsoonMaiTai: Recipe = {
  slug: "monsoon-mai-tai",
  name: "Monsoon Mai Tai",
  tagline: "Weather any storm",
  description: "Our take on the tiki classic uses both our spirits for a complex, tropical escape. Strong enough to weather any storm, balanced enough to enjoy several.",
  spirit: "The Quartermaster's Reserve & Expedition Spiced",
  difficulty: "Medium",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Double rocks glass",
  ingredients: [ { amount: "30ml", item: "The Quartermaster's Reserve" }, { amount: "30ml", item: "Expedition Spiced" }, { amount: "15ml", item: "Orange curaçao" }, { amount: "15ml", item: "Orgeat syrup" }, { amount: "30ml", item: "Fresh lime juice" }, { amount: "Crushed", item: "Ice" } ],
  instructions: [ "Add all ingredients to a shaker with ice.", "Shake vigorously for 10 seconds.", "Pour entire contents into a double rocks glass.", "Top with more crushed ice.", "Garnish elaborately with mint, lime wheel, and cherry." ],
  garnish: "Mint bouquet, lime wheel, and skewered cherry",
  tips: [ "Quality orgeat makes a huge difference.", "Float 10ml of dark rum for extra depth.", "Flaming lime shell for dramatic presentation." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Monsoon Mai Tai with elaborate tropical garnish."
};

// 15. Cartographer's Gimlet
export const cartographersGimlet: Recipe = {
  slug: "cartographers-gimlet",
  name: "Cartographer's Gimlet",
  tagline: "Precision in every measure",
  description: "A sharp, clean cocktail that cuts straight to the point. Expedition Spiced brings warmth to this traditionally gin-based naval classic.",
  spirit: "Expedition Spiced",
  difficulty: "Easy",
  prepTime: "3 minutes",
  servings: "1 cocktail",
  glassware: "Coupe or martini glass",
  ingredients: [ { amount: "60ml", item: "Expedition Spiced" }, { amount: "20ml", item: "Fresh lime juice" }, { amount: "15ml", item: "Simple syrup" } ],
  instructions: [ "Add all ingredients to a shaker with ice.", "Shake vigorously for 10 seconds.", "Double strain into a chilled coupe glass.", "Garnish with a thin lime wheel." ],
  garnish: "Thin lime wheel",
  tips: [ "Try with lime cordial for a more traditional approach.", "Add a few drops of saline for enhanced flavour.", "Cucumber ribbon makes an elegant alternative garnish." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Cartographer's Gimlet in elegant coupe with lime wheel."
};

// 16. Sentinel's Sazerac
export const sentinelsSazerac: Recipe = {
  slug: "sentinels-sazerac",
  name: "Sentinel's Sazerac",
  tagline: "Standing guard over tradition",
  description: "A rum twist on the New Orleans classic. The Quartermaster's Reserve stands in beautifully for whiskey in this absinthe-rinsed powerhouse.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Advanced",
  prepTime: "7 minutes",
  servings: "1 cocktail",
  glassware: "Rocks glass",
  ingredients: [ { amount: "60ml", item: "The Quartermaster's Reserve" }, { amount: "5ml", item: "Absinthe", note: "for rinse" }, { amount: "1", item: "Sugar cube" }, { amount: "3 dashes", item: "Peychaud's bitters" }, { amount: "1 dash", item: "Angostura bitters" }, { amount: "1", item: "Lemon peel", note: "for oils only" } ],
  instructions: [ "Chill a rocks glass with ice.", "In a mixing glass, muddle sugar cube with both bitters.", "Add rum and ice, stir until well chilled.", "Discard ice from rocks glass and rinse with absinthe.", "Strain cocktail into the prepared glass.", "Express lemon oils over surface and discard peel." ],
  garnish: "Lemon peel (expressed and discarded)",
  tips: [ "The absinthe rinse is key - don't skip it.", "No ice in the final drink is traditional.", "Try different bitters combinations for variation." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Sentinel's Sazerac in rocks glass with lemon oils."
};

// 17. Provision Pack Punch
export const provisionPackPunch: Recipe = {
  slug: "provision-pack-punch",
  name: "Provision Pack Punch",
  tagline: "Everything you need in one glass",
  description: "A tropical punch that packs everything you need for the journey ahead. This individual serving brings the party to your palm.",
  spirit: "Expedition Spiced",
  difficulty: "Medium",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Hurricane glass or large goblet",
  ingredients: [ { amount: "45ml", item: "Expedition Spiced" }, { amount: "15ml", item: "Velvet Falernum" }, { amount: "20ml", item: "Pineapple juice" }, { amount: "20ml", item: "Orange juice" }, { amount: "15ml", item: "Fresh lime juice" }, { amount: "10ml", item: "Grenadine" }, { amount: "Crushed", item: "Ice" } ],
  instructions: [ "Add all ingredients to a shaker with ice.", "Shake vigorously for 10 seconds.", "Pour into hurricane glass filled with crushed ice.", "Swizzle briefly to mix.", "Garnish with tropical fruits and umbrella." ],
  garnish: "Pineapple wedge, orange wheel, cherry, and cocktail umbrella",
  tips: [ "Fresh juices are essential here.", "Float different rums for a 'rainbow' effect.", "Hollow pineapple makes a great serving vessel." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Provision Pack Punch with elaborate tropical garnish."
};

// 18. Quartermaster's Quaff
export const quartermastersQuaff: Recipe = {
  slug: "quartermasters-quaff",
  name: "Quartermaster's Quaff",
  tagline: "Simple pleasures, perfectly executed",
  description: "Sometimes simplicity is sophistication. This two-ingredient serve lets The Quartermaster's Reserve shine with just a quality mixer.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Easy",
  prepTime: "2 minutes",
  servings: "1 cocktail",
  glassware: "Highball glass",
  ingredients: [ { amount: "50ml", item: "The Quartermaster's Reserve" }, { amount: "150ml", item: "Premium cola", note: "or ginger ale" }, { amount: "Cubed", item: "Ice" }, { amount: "1", item: "Lime wedge" } ],
  instructions: [ "Fill highball glass with ice.", "Add The Quartermaster's Reserve.", "Top with cola or ginger ale.", "Stir gently to combine.", "Squeeze lime wedge and drop in." ],
  garnish: "Lime wedge",
  tips: [ "Quality mixer makes all the difference.", "Try with different sodas - elderflower, bitter lemon, etc.", "Build in the glass to preserve carbonation." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Quartermaster's Quaff highball with lime garnish."
};

// 19. Expedition Espresso
export const expeditionEspresso: Recipe = {
  slug: "expedition-espresso",
  name: "Expedition Espresso",
  tagline: "Fuel for the journey ahead",
  description: "Our spiced rum meets fresh espresso in this energizing cocktail. Perfect as an after-dinner drink or when the night is just beginning.",
  spirit: "Expedition Spiced",
  difficulty: "Medium",
  prepTime: "5 minutes",
  servings: "1 cocktail",
  glassware: "Coupe or martini glass",
  ingredients: [ { amount: "45ml", item: "Expedition Spiced" }, { amount: "30ml", item: "Fresh espresso", note: "cooled" }, { amount: "15ml", item: "Coffee liqueur" }, { amount: "10ml", item: "Vanilla syrup" } ],
  instructions: [ "Brew espresso and let cool for 1 minute.", "Add all ingredients to shaker with ice.", "Shake very vigorously for 15 seconds.", "Double strain into chilled coupe.", "Garnish with 3 coffee beans." ],
  garnish: "3 coffee beans",
  tips: [ "Fresh espresso is crucial - no instant!", "Shake extra hard for good foam.", "Dust with cinnamon for extra spice." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "Expedition Espresso with coffee bean garnish."
};

// 20. The Last Post
export const theLastPost: Recipe = {
  slug: "the-last-post",
  name: "The Last Post",
  tagline: "End the day with honour",
  description: "A contemplative nightcap that combines The Quartermaster's Reserve with amaro for a bittersweet finale. The perfect end to any expedition.",
  spirit: "The Quartermaster's Reserve",
  difficulty: "Easy",
  prepTime: "3 minutes",
  servings: "1 cocktail",
  glassware: "Rocks glass",
  ingredients: [ { amount: "45ml", item: "The Quartermaster's Reserve" }, { amount: "30ml", item: "Amaro", note: "Averna or similar" }, { amount: "2 dashes", item: "Orange bitters" }, { amount: "1", item: "Large ice cube" } ],
  instructions: [ "Add all ingredients to a mixing glass with ice.", "Stir for 30 seconds until well chilled.", "Strain over large ice cube in rocks glass.", "Express orange oils over surface.", "Garnish with orange peel." ],
  garnish: "Orange peel",
  tips: [ "Different amaros create different profiles.", "Try with a bar spoon of cherry liqueur.", "Smoke the glass for added complexity." ],
  image: "/images/cocktails/placeholder.jpg",
  imageAlt: "The Last Post in rocks glass with orange peel."
};

// Export all recipes as an array for easy iteration
export const allRecipes: Recipe[] = [
  quartermastersOldFashioned,
  nightWatchNegroni,
  reconnaissanceRefresher,
  expeditionMule,
  campfirePunch,
  jerryCanJulep,
  navigatorsSour,
  baseCampBoulevardier,
  summitSpritz,
  watchCommander,
  trailblazersToddy,
  compassRoseCollins,
  fieldRationsFlip,
  monsoonMaiTai,
  cartographersGimlet,
  sentinelsSazerac,
  provisionPackPunch,
  quartermastersQuaff,
  expeditionEspresso,
  theLastPost
];