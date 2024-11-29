
console.log(process.env.JWT_SECRET, "JWT_SECRET")
export const jwtConstants = {
    secret: process.env.JWT_SECRET || 'kjnvjfvjndjvwsijdnviwjc',
  };