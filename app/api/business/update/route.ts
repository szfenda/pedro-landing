import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'
import { businessFormSchema } from '@/lib/validations'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Extract partnerId from body
    const { partnerId, ...businessData } = body

    if (!partnerId) {
      return NextResponse.json(
        { success: false, message: 'Brak ID partnera' },
        { status: 400 }
      )
    }

    // Validate business data
    const validatedData = businessFormSchema.parse(businessData)

    // Get auth token from cookies
    const authToken = request.cookies.get('firebase-auth-token')?.value

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    // Verify the token and get user
    const decodedToken = await adminAuth.verifyIdToken(authToken)
    const uid = decodedToken.uid

    // Get partner document to verify ownership
    const partnerDoc = await adminDb.collection('partners').doc(partnerId).get()

    if (!partnerDoc.exists) {
      return NextResponse.json(
        { success: false, message: 'Nie znaleziono biznesu' },
        { status: 404 }
      )
    }

    const partnerData = partnerDoc.data()

    // Verify user owns this partner
    if (partnerData?.userId !== uid) {
      return NextResponse.json(
        { success: false, message: 'Brak uprawnień do edycji tego biznesu' },
        { status: 403 }
      )
    }

    // Update partner document
    const updateData = {
      companyName: validatedData.companyName,
      nip: validatedData.nip,
      businessType: validatedData.businessType,
      address: validatedData.address,
      email: validatedData.email,
      phone: validatedData.phone,
      contactPersonName: validatedData.contactPersonName,
      website: validatedData.website || null,
      description: validatedData.description,
      updatedAt: new Date(),
    }

    await adminDb.collection('partners').doc(partnerId).update(updateData)

    // Get updated document
    const updatedDoc = await adminDb.collection('partners').doc(partnerId).get()
    const updatedData = {
      id: updatedDoc.id,
      ...updatedDoc.data(),
    }

    console.log(`Updated partner: ${partnerId}`)

    return NextResponse.json({
      success: true,
      message: 'Dane biznesu zostały zaktualizowane.',
      data: {
        partner: updatedData,
      }
    })

  } catch (error: any) {
    console.error('Error updating business:', error)

    // Handle validation errors
    if (error.name === 'ZodError') {
      const firstError = error.errors[0]
      return NextResponse.json(
        { success: false, message: firstError.message },
        { status: 400 }
      )
    }

    // Handle Firestore errors
    if (error.code === 'not-found') {
      return NextResponse.json(
        { success: false, message: 'Nie znaleziono biznesu' },
        { status: 404 }
      )
    }

    if (error.code === 'permission-denied') {
      return NextResponse.json(
        { success: false, message: 'Brak uprawnień' },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Wystąpił błąd podczas aktualizacji danych biznesu' },
      { status: 500 }
    )
  }
}