export const getCurrentUser = (req, res) => {
    const userDto = {
        id: req.user._id,
        email: req.user.email,
        // Agrega otros campos que consideres necesarios
    };
    res.json(userDto);
};
