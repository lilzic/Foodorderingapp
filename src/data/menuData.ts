import { MenuItem } from "../types";

export const menuItems: MenuItem[] = [
  // Main Dishes
  {
    id: "1",
    name: "Jollof Rice",
    description:
      "Classic Nigerian Jollof rice with rich tomato sauce and spices",
    price: 1000,
    category: "main",
    image:
      "https://images.unsplash.com/photo-1665332195309-9d75071138f0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am9sbG9mJTIwcmljZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "2",
    name: "Pounded Yam and Vegetable Soup",
    description: "Pounded and soup with stock fish and pomo",
    price: 1700,
    category: "main",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnVmdXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "3",
    name: "Pounded Yam and Egusi soup",
    description: "Smooth pounded yam served with rich soup",
    price: 1700,
    category: "main",
    image:
      "https://media.istockphoto.com/id/1174341228/photo/nigerian-pounded-yam-served-with-spicy-bitter-leaf-soup.webp?a=1&b=1&s=612x612&w=0&k=20&c=FwO1BgtsapNzGIibmvgKD2mGBIVHZjf9o2cVJbV5LBc=",
  },
  {
    id: "4",
    name: "Pounded Yam and Ogbono soup",
    description: "Sharp Ogbono soup together with Pounded Yam",
    price: 1700,
    category: "main",
    image:
      "https://media.istockphoto.com/id/1008392778/photo/nigerian-traditional-pounded-yam-served-with-ogbono-soup.webp?a=1&b=1&s=612x612&w=0&k=20&c=78_RRl2OJYn2l6PIcaqHiygKzIhZkNzk0fjx_bApFSE=",
  },
  {
    id: "5",
    name: "Semo and Egusi soup",
    description: "Sharp Egusi soup together with semo",
    price: 1500,
    category: "main",
    image:
      "https://media.istockphoto.com/id/1386522263/photo/pounded-yam-and-garri-eba-served-with-egusi-soup-ready-to-eat.jpg?s=1024x1024&w=is&k=20&c=hnM2s9lvU6EPoPttAr5qP4RUMifqWw7w6CkLT6J-BSA=",
  },
  {
    id: "6",
    name: "Semo and Ogbono soup",
    description: "Sharp Ogbono soup together with semo",
    price: 1500,
    category: "main",
    image:
      "https://media.istockphoto.com/id/1008392778/photo/nigerian-traditional-pounded-yam-served-with-ogbono-soup.webp?a=1&b=1&s=612x612&w=0&k=20&c=78_RRl2OJYn2l6PIcaqHiygKzIhZkNzk0fjx_bApFSE=",
  },
  {
    id: "7",
    name: "Semo and Vegetable soup",
    description:
      "Sharp Vegetable soup together with any swallow of your choice",
    price: 1500,
    category: "main",
    image:
      "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmlnZXJpYW4lMjB2ZWdldGFibGUlMjBzb3VwfGVufDB8fDB8fHww",
  },
  {
    id: "8",
    name: "Indomie no egg",
    description: "Spicy Nigerian Indomie noodles",
    price: 700,
    category: "main",
    image:
      "https://media.istockphoto.com/id/1125876951/photo/indomie-noodles.webp?a=1&b=1&s=612x612&w=0&k=20&c=FCwTy0unq1sIX42goUSVmP34EPSiVi8Z6Dd8bjvUY-g=",
  },
  {
    id: "9",
    name: "Moi Moi and stew",
    description: "Steamed bean pudding with peppers and stew",
    price: 500,
    category: "main",
    image:
      "https://images.unsplash.com/photo-1661588669110-81142a5b9e57?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwYmVhbiUyMGNha2V8ZW58MXx8fHwxNzY0MTU1NjAxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: "10",
    name: "Samosa",
    description: "Crispy Nigerian samosa with savory filling",
    price: 200,
    category: "main",
    image:
      "https://images.unsplash.com/photo-1697155836252-d7f969108b5a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHNhbW9zYXxlbnwwfHwwfHx8MA%3D%3D",
  },

  // Add-ons
  {
    id: "11",
    name: "Fried egg",
    description:
      "Fried egg can be eaten together with the indomie",
    price: 300,
    category: "addon",
    image:
      "https://images.unsplash.com/photo-1691480184494-d9f822edd4d1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZnJpZWQlMjBlZ2d8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "12",
    name: "Fried Meat",
    description: "Crispy fried meat pieces",
    price: 500,
    category: "addon",
    image:
      "https://images.unsplash.com/photo-1678684277852-f63a7e359435?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGZyaWVkJTIwbWVhdHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: "13",
    name: "Coleslaw/salad",
    description: "Fresh cabbage and carrot salad",
    price: 500,
    category: "addon",
    image:
      "https://images.unsplash.com/photo-1573403707491-38a4ea19edc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xlc2xhdyUyMHNhbGFkfGVufDF8fHx8MTc2MzIzMzMzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
];