// components/WhatsappButton.tsx
import Link from 'next/link'

export default function WhatsappButton() {
  const whatsappNumber = '5491165899729'
  const message = 'Hola, me gustaria más información sobre tus servicios!'
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`

  return (
    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer">
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center w-14 h-14">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            fill="currentColor"
            className="w-10 h-10"
          >
            <path d="M16 0C7.164 0 0 6.953 0 15.529c0 2.738.733 5.387 2.126 7.715L0 32l8.043-2.1a15.98 15.98 0 0 0 7.957 2.029c8.836 0 16-6.953 16-15.529C32 6.953 24.836 0 16 0Zm0 28.471c-2.25 0-4.456-.57-6.403-1.649l-.457-.256-4.775 1.246 1.275-4.583-.296-.47c-1.19-1.9-1.817-4.1-1.817-6.23 0-6.529 5.6-11.857 12.471-11.857 6.869 0 12.471 5.328 12.471 11.857 0 6.528-5.602 11.857-12.471 11.857Zm7.38-8.675c-.38-.191-2.25-1.11-2.599-1.236-.348-.127-.602-.191-.855.192s-.983 1.236-1.205 1.487c-.221.256-.443.287-.822.096-.38-.192-1.602-.59-3.052-1.883-1.127-1.002-1.887-2.237-2.108-2.615-.221-.383-.024-.59.168-.781.172-.17.38-.443.572-.664.192-.224.253-.384.38-.64.127-.255.064-.479-.031-.67-.096-.192-.855-2.063-1.172-2.822-.31-.745-.624-.64-.855-.653l-.73-.014c-.222 0-.583.08-.89.383s-1.17 1.142-1.17 2.78 1.198 3.224 1.363 3.445c.166.223 2.358 3.6 5.716 5.045 3.358 1.446 3.358.963 3.967.902.608-.064 1.933-.787 2.205-1.545.273-.76.273-1.41.192-1.546-.08-.128-.304-.208-.635-.367Z" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
