import { backgrounds, mascots } from '@/lib/assets'

interface AuthShellProps {
  children: React.ReactNode
  leftContent?: React.ReactNode
  showBackToLanding?: boolean
}

export default function AuthShell({ 
  children, 
  leftContent, 
  showBackToLanding = true 
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-pedro-light">
      {/* Auth Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 md:h-20 bg-gradient-to-b from-black/20 via-black/10 to-transparent backdrop-blur-md border-b border-white/20">
        <div className="h-full flex items-center justify-between px-6 md:px-12">
          {/* Logo */}
          <div className="flex items-center">
            <a
              href="/"
              className="text-white font-headline text-2xl md:text-3xl font-bold transition-all duration-300 hover:rotate-2 hover:scale-105"
            >
              PEDRO
            </a>
          </div>

          {/* Back to Landing */}
          {showBackToLanding && (
            <div>
              <a
                href="/"
                className="btn-brutal btn-brutal-purple px-4 py-2 text-sm hover:-translate-y-1 hover:shadow-brutal-lime transition-all duration-300"
              >
                Wróć na stronę główną
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16 md:pt-20">
        <div className="min-h-screen flex">
          {/* Left Side - Content */}
          <div 
            className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12"
            style={{
              backgroundImage: `url(${backgrounds.heroLeft})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative z-10 max-w-md text-center text-white">
              {leftContent || (
                <>
                  <h1 className="font-headline text-4xl xl:text-5xl font-bold mb-6 text-shadow-lg">
                    Witaj w PEDRO
                  </h1>
                  <p className="text-lg mb-8 opacity-90">
                    Twój osobisty asystent promocji. Poluj na promki, oszczędzaj pieniądze.
                  </p>
                  
                  {/* Benefit chips */}
                  <div className="flex flex-wrap gap-3 justify-center mb-8">
                    <span className="px-4 py-2 bg-pedro-lime text-pedro-dark rounded-button font-bold text-sm">
                      Lokalnie
                    </span>
                    <span className="px-4 py-2 bg-pedro-lime text-pedro-dark rounded-button font-bold text-sm">
                      Bez spamu
                    </span>
                    <span className="px-4 py-2 bg-pedro-lime text-pedro-dark rounded-button font-bold text-sm">
                      Szybko przy kasie
                    </span>
                  </div>

                  {/* Pedro mascot */}
                  <div className="animate-float">
                    <img
                      src={mascots.thumbsUp}
                      alt="Pedro thumbs up"
                      width={200}
                      height={200}
                      className="mx-auto opacity-90"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Floating decorations */}
            <div className="absolute top-20 left-20 w-8 h-8 bg-pedro-lime rounded-full opacity-60 animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-32 right-16 w-6 h-6 bg-pedro-pink rounded-full opacity-60 animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/3 right-32 w-4 h-4 bg-pedro-purple rounded-full opacity-60 animate-float" style={{ animationDelay: '1.5s' }}></div>
          </div>

          {/* Separator */}
          <div className="hidden lg:block w-0.5 bg-pedro-dark"></div>

          {/* Right Side - Form */}
          <div 
            className="w-full lg:w-1/2 relative flex items-center justify-center p-6 md:p-12"
            style={{
              backgroundImage: `url(${backgrounds.heroRight})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Overlay for better form readability */}
            <div className="absolute inset-0 bg-white/80 lg:bg-white/60"></div>
            
            <div className="relative z-10 w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}