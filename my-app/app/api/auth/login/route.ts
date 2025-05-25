import { NextResponse } from 'next/server';
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    // Validación básica
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Conectar a la base de datos
    await dbConnect();

    const existingUser = await User.findOne({ username });

    console.log('Login attempt:', { username, userFound: !!existingUser });

    if (!existingUser) {
      return NextResponse.json(
        { error: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const isPasswordValid = existingUser.password === password; // Simulación de validación de contraseña

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'INVALID_PASSWORD' },
        { status: 401 }
      );
    }

    // Login exitoso
    return NextResponse.json({
      success: true,
      user: {
        id: existingUser._id.toString(),
        username: existingUser.username,
        createdAt: existingUser.createdAt,
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
