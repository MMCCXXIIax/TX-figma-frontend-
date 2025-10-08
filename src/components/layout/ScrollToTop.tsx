import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled up to given distance
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Listen for scroll events
    window.addEventListener('scroll', toggleVisibility);

    // Clean up the event listener
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToTop();
    }
  };

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          onKeyDown={handleKeyDown}
          className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full bg-sky-600 hover:bg-sky-700 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110"
          size="icon"
          title="Scroll to top"
          aria-label="Scroll to top of page"
        >
          <ChevronUp className="h-6 w-6 text-white" />
        </Button>
      )}
    </>
  );
}