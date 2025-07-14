/*// app/api/upload/university-image/route.ts
import { NextRequest, NextResponse } from "next/server";
//import { uploadUniversityImage } from "../../../universities/actions/UniActions";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    //const result = await uploadUniversityImage(formData);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        imageUrl: result.image.imageUrl,
        image: result.image,
        message: result.message,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          details: result.details,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}*/