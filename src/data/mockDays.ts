export interface Problem {
  name: string;
  difficulty: "Easy" | "Medium" | "Hard" | string;
  leetcodeUrl: string;
  youtubeUrl: string | null;
  gfgUrl: string | null;
  done: boolean;
  isMissingVideo?: boolean;
}

export interface Day {
  id: number;
  pattern: string;
  topic: string;
  date?: string;
  youtubeId: string;
  problems: Problem[];
  done: boolean;
  notes: string;
  lastEdited?: string;
}

export const MOCK_DAYS: Day[] = [
  {
    "id": 1,
    "pattern": "Two-Pointer",
    "topic": "Array Basics + Two-Pointer Intro",
    "date": "Jul 1",
    "youtubeId": "o_fANlVBKuU",
    "problems": [
      {
        "name": "Two Sum",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/two-sum/",
        "youtubeUrl": "https://www.youtube.com/watch?v=o_fANlVBKuU&list=PLvNVexrplJJzvtkPJ6tTZGqbwd5NlJBF2",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/pair-with-given-sum-in-a-sorted-array4940/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Valid Palindrome",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome/",
        "youtubeUrl": "https://www.youtube.com/watch?v=L84y20axpIA",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/string-palindromic-ignoring-spaces4723/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Move Zeroes",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/move-zeroes/",
        "youtubeUrl": "https://www.youtube.com/watch?v=kxibKXHbgVs&list=PLvNVexrplJJzvtkPJ6tTZGqbwd5NlJBF2&index=4",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/move-all-zeroes-to-end-of-array0751/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Remove Duplicates from Sorted Array",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicates-from-sorted-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 2,
    "pattern": "Two-Pointer",
    "topic": "Two-Pointer: Classic Problems",
    "date": "Jul 2",
    "youtubeId": "PShx8lzd8_E",
    "problems": [
      {
        "name": "Three Sum",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/3sum/",
        "youtubeUrl": "https://www.youtube.com/watch?v=PShx8lzd8_E&list=PLvNVexrplJJzvtkPJ6tTZGqbwd5NlJBF2&index=2",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/triplet-sum-in-array-1587115621/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Container With Most Water",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/container-with-most-water/",
        "youtubeUrl": "https://www.youtube.com/watch?v=eiYG5tDu_Ok&list=PLvNVexrplJJzvtkPJ6tTZGqbwd5NlJBF2&index=5",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/container-with-most-water0535/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Squares of Sorted Array",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/squares-of-a-sorted-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sort Colors (Dutch Flag)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/sort-colors/",
        "youtubeUrl": "https://www.youtube.com/watch?v=E-txNhS9TnI&list=PLvNVexrplJJzvtkPJ6tTZGqbwd5NlJBF2&index=3",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/sort-an-array-of-0s-1s-and-2s4231/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 3,
    "pattern": "Sliding Window",
    "topic": "Sliding Window: Fixed Size",
    "date": "Jul 3",
    "youtubeId": "dgjKO46bu3A",
    "problems": [
      {
        "name": "Maximum Average Subarray I",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-average-subarray-i/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Maximum Sum of Distinct Subarrays With Length K",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/",
        "youtubeUrl": "https://www.youtube.com/watch?v=dgjKO46bu3A&list=PLvNVexrplJJyQTJ7a6sx3MzZjq1cR2geB&index=2",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/max-sum-subarray-of-size-k5313/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Number of Sub-arrays of Size K and Average >= Threshold",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 4,
    "pattern": "Sliding Window",
    "topic": "Sliding Window: Variable Size",
    "date": "Jul 4",
    "youtubeId": "92dMI4paQY4",
    "problems": [
      {
        "name": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        "youtubeUrl": "https://youtu.be/92dMI4paQY4",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Minimum Size Subarray Sum",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-size-subarray-sum/",
        "youtubeUrl": "https://www.youtube.com/watch?v=A5XgKA7FDQE&list=PLvNVexrplJJyQTJ7a6sx3MzZjq1cR2geB&index=6",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/smallest-subarray-with-sum-greater-than-x5651/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Fruit Into Baskets",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/fruit-into-baskets/",
        "youtubeUrl": "https://www.youtube.com/watch?v=kge_3sdDWfE&list=PLvNVexrplJJyQTJ7a6sx3MzZjq1cR2geB&index=7",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/fruit-into-baskets-1663137462/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 5,
    "pattern": "Sliding Window",
    "topic": "Sliding Window: Hard Variants",
    "date": "Jul 5",
    "youtubeId": "9w9xip122n8",
    "problems": [
      {
        "name": "Minimum Window Substring",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
        "youtubeUrl": "https://youtu.be/9w9xip122n8",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Permutation in String",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/permutation-in-string/",
        "youtubeUrl": "https://youtu.be/7ZKe7P5bJbA",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/permutations-of-a-given-string-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Find All Anagrams in a String",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-all-anagrams-in-a-string/",
        "youtubeUrl": "https://youtu.be/91SdYBHSvjE",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/count-occurences-of-anagrams5839/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 6,
    "pattern": "Prefix Sum",
    "topic": "Prefix Sum Basics",
    "date": "Jul 6",
    "youtubeId": "d2wUDNz_6iA",
    "problems": [
      {
        "name": "Range Sum Query - Immutable",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/range-sum-query-immutable/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/subarray-sum-equals-k/",
        "youtubeUrl": "https://www.youtube.com/watch?v=d2wUDNz_6iA&list=PLvNVexrplJJzc0FYDK1M7feNLJVSCV-cL&index=5",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/subarrays-with-sum-k/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Find Pivot Index",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/find-pivot-index/",
        "youtubeUrl": "https://www.youtube.com/watch?v=WOivGAlWxlM&list=PLvNVexrplJJzc0FYDK1M7feNLJVSCV-cL",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/equilibrium-point-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Product of Array Except Self",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/product-of-array-except-self/",
        "youtubeUrl": "https://www.youtube.com/watch?v=I4zq1fXgugY&list=PLvNVexrplJJzc0FYDK1M7feNLJVSCV-cL&index=3",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/product-array-puzzle4525/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 7,
    "pattern": "Prefix Sum",
    "topic": "Prefix Sum Advanced",
    "date": "Jul 7",
    "youtubeId": "",
    "problems": [
      {
        "name": "Contiguous Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/contiguous-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Range Sum Query 2D - Immutable",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/range-sum-query-2d-immutable/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 8,
    "pattern": "Kadane's Algorithm",
    "topic": "Kadane's Algorithm",
    "date": "Jul 8",
    "youtubeId": "CU_TwNzuttQ",
    "problems": [
      {
        "name": "Maximum Subarray",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
        "youtubeUrl": "https://www.youtube.com/watch?v=CU_TwNzuttQ&list=PLvNVexrplJJy-eQ3PNGlfRN2IvC9VE_Zz&index=22",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Maximum Product Subarray",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-product-subarray/",
        "youtubeUrl": "https://www.youtube.com/watch?v=JjxEFeNdOoE&list=PLvNVexrplJJy-eQ3PNGlfRN2IvC9VE_Zz&index=23",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-product-subarray3604/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Best Time to Buy and Sell Stock",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/buy-maximum-stocks-if-i-stocks-can-be-bought-on-i-th-day/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Maximum Sum Circular Subarray",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-sum-circular-subarray/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/max-circular-subarray-sum-1587115620/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 9,
    "pattern": "Kadane's Algorithm",
    "topic": "Kadane's Extended + Revision",
    "date": "Jul 9",
    "youtubeId": "CU_TwNzuttQ",
    "problems": [
      {
        "name": "House Robber (Max Sum Non-Adjacent)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/stickler-theif-1587115621/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Maximum Subarray (print subarray)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-subarray/",
        "youtubeUrl": "https://www.youtube.com/watch?v=CU_TwNzuttQ&list=PLvNVexrplJJy-eQ3PNGlfRN2IvC9VE_Zz&index=22",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/kadanes-algorithm-1587115620/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 10,
    "pattern": "Two-Pointer (Palindrome)",
    "topic": "String Two-Pointer (Palindrome)",
    "date": "Jul 10",
    "youtubeId": "lVFCrcWz7JA",
    "problems": [
      {
        "name": "Valid Palindrome II",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/valid-palindrome-ii/",
        "youtubeUrl": "https://youtu.be/lVFCrcWz7JA?si=1jKSZ9WWGjLwr7mS",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/palindrome-string0817/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Palindromic Substrings",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/palindromic-substrings/",
        "youtubeUrl": "https://youtu.be/vb88HyMMbig",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/count-palindrome-sub-strings-of-a-string0652/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Longest Palindromic Substring",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-substring/",
        "youtubeUrl": "https://youtu.be/5MS14_6rSa8",
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/longest-palindrome-in-a-string3411/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Reverse Vowels of a String",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-vowels-of-a-string/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 11,
    "pattern": "Sliding Window (String)",
    "topic": "String Sliding Window",
    "date": "Jul 11",
    "youtubeId": "sVEFAIUmTuM",
    "problems": [
      {
        "name": "Longest Repeating Character Replacement",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-repeating-character-replacement/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Max Consecutive Ones III",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/max-consecutive-ones-iii/",
        "youtubeUrl": "https://www.youtube.com/watch?v=sVEFAIUmTuM&list=PLvNVexrplJJyQTJ7a6sx3MzZjq1cR2geB&index=4",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximize-number-of-1s0905/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Longest Subarray of 1s After Deleting One Element",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 12,
    "pattern": "Review",
    "topic": "REVISION DAY",
    "date": "Jul 12",
    "youtubeId": "",
    "problems": [
      {
        "name": "Re-solve 3 problems you found hard this week",
        "difficulty": "Easy",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Try 1 new Two-Pointer problem",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 13,
    "pattern": "Classic Binary Search",
    "topic": "Classic Binary Search",
    "date": "Jul 13",
    "youtubeId": "bjMOevaiZn0",
    "problems": [
      {
        "name": "Binary Search",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/binary-search/",
        "youtubeUrl": "https://youtu.be/bjMOevaiZn0?si=1En1Sz8BoLlpg9LD",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/binary-search-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Search Insert Position",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/search-insert-position/",
        "youtubeUrl": "https://youtu.be/-UyYRPvYNkI?si=_m0S-b7Vie2w643t",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/search-insert-position-of-k-in-a-sorted-array/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Guess Number Higher or Lower",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/guess-number-higher-or-lower/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "First Bad Version",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/first-bad-version/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 14,
    "pattern": "Classic Binary Search",
    "topic": "Binary Search: Edge Cases",
    "date": "Jul 14",
    "youtubeId": "eDC6Pk-LQDw",
    "problems": [
      {
        "name": "Find Minimum in Rotated Sorted Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        "youtubeUrl": "https://youtu.be/eDC6Pk-LQDw?si=ERs4FwLlwDkCSNMO",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/minimum-element-in-a-sorted-and-rotated-array3611/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Search in Rotated Sorted Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        "youtubeUrl": "https://youtu.be/aFN2LrKg6i0?si=djEiRxbZse_2GViD",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/search-in-a-rotated-array4618/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 15,
    "pattern": "Lower / Upper Bound",
    "topic": "Lower / Upper Bound",
    "date": "Jul 15",
    "youtubeId": "ThfrnBTyPNY",
    "problems": [
      {
        "name": "Find First and Last Position of Element",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        "youtubeUrl": "https://youtu.be/ThfrnBTyPNY?si=90O7yBlX6Yr_wtVm",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/first-and-last-occurrences-of-x3116/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Count of Smaller Numbers After Self",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/count-of-smaller-numbers-after-self/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sqrt(x)",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/sqrtx/",
        "youtubeUrl": "https://www.youtube.com/watch?v=-gUwj9ZSRn8&list=PLvNVexrplJJx8Fi1geIYySPo3L13-0ZJr&index=2",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/square-root/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Koko Eating Bananas",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/koko-eating-bananas/",
        "youtubeUrl": "https://youtu.be/sPlRs126bFU?si=8mCShPyIVcIMUgPe",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/koko-eating-bananas/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 16,
    "pattern": "Binary Search on Answers",
    "topic": "Binary Search on Answers",
    "date": "Jul 16",
    "youtubeId": "rJ1Ih0BLRW0",
    "problems": [
      {
        "name": "Capacity to Ship Packages Within D Days",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/",
        "youtubeUrl": "https://youtu.be/rJ1Ih0BLRW0?si=DUydKTlbeARqjYIC",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/capacity-to-ship-packages-within-d-days/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Split Array Largest Sum",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/split-array-largest-sum/",
        "youtubeUrl": "https://www.youtube.com/watch?v=nNlRAJ_jv_Y",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/split-array-largest-sum--141634/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Minimum Number of Days to Make m Bouquets",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/",
        "youtubeUrl": "https://www.youtube.com/watch?v=n4F8Q5HV8RY",
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 17,
    "pattern": "Binary Search on Answers",
    "topic": "Binary Search on Answers II",
    "date": "Jul 17",
    "youtubeId": "oAD4ctsWRpY",
    "problems": [
      {
        "name": "Find the Smallest Divisor Given a Threshold",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Magnetic Force Between Two Balls",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/magnetic-force-between-two-balls/",
        "youtubeUrl": "https://www.youtube.com/watch?v=oAD4ctsWRpY",
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Minimize Max Distance to Gas Station",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/minimize-max-distance-to-gas-station/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 18,
    "pattern": "Search in 2D Matrix",
    "topic": "2D Matrix Binary Search",
    "date": "Jul 18",
    "youtubeId": "2jqTPmHyz8U",
    "problems": [
      {
        "name": "Search a 2D Matrix",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix/",
        "youtubeUrl": "https://www.youtube.com/watch?v=2jqTPmHyz8U",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/search-in-a-matrix17201720/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Search a 2D Matrix II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/search-a-2d-matrix-ii/",
        "youtubeUrl": "https://www.youtube.com/watch?v=bNKpSXldPh4",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/search-in-a-matrix-1587115621/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Find Peak Element",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-peak-element/",
        "youtubeUrl": "https://youtu.be/NUnhHa47f-Q?si=S37zB8zQ2B2k5g6G",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/peak-element/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 19,
    "pattern": "Review",
    "topic": "REVISION: Arrays + Binary Search",
    "date": "Jul 19",
    "youtubeId": "bjMOevaiZn0",
    "problems": [
      {
        "name": "Solve 2 array problems",
        "difficulty": "Easy",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Solve 2 binary search problems",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": "https://youtu.be/bjMOevaiZn0?si=1En1Sz8BoLlpg9LD",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/binary-search-1587115620/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 20,
    "pattern": "Monotonic Stack",
    "topic": "Monotonic Stack: Next Greater",
    "date": "Jul 20",
    "youtubeId": "rfl_M3SuvIE",
    "problems": [
      {
        "name": "Next Greater Element I",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/next-greater-element-i/",
        "youtubeUrl": "https://youtu.be/rfl_M3SuvIE",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/next-larger-element-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Next Greater Element II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/next-greater-element-ii/",
        "youtubeUrl": "https://youtu.be/s0ly3pzYnVo",
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Daily Temperatures",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/daily-temperatures/",
        "youtubeUrl": "https://youtu.be/OQY4tbt_m6I",
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Largest Rectangle in Histogram",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        "youtubeUrl": "https://youtu.be/OQJjh6AT00g",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-rectangular-area-in-a-histogram-1587115620/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 21,
    "pattern": "Monotonic Stack",
    "topic": "Monotonic Stack: Min/Max",
    "date": "Jul 21",
    "youtubeId": "uLCmHMPQo2M",
    "problems": [
      {
        "name": "Trapping Rain Water",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/trapping-rain-water/",
        "youtubeUrl": "https://www.youtube.com/watch?v=uLCmHMPQo2M&list=PLvNVexrplJJzvtkPJ6tTZGqbwd5NlJBF2&index=6",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Sum of Subarray Minimums",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/sum-of-subarray-minimums/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Online Stock Span",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/online-stock-span/",
        "youtubeUrl": "https://youtu.be/6Izu3F3vibo",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/stock-span-problem-1587115621/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 22,
    "pattern": "Expression Evaluation",
    "topic": "Stack: Expression Evaluation",
    "date": "Jul 22",
    "youtubeId": "UFU7usbJj3s",
    "problems": [
      {
        "name": "Basic Calculator II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/basic-calculator-ii/",
        "youtubeUrl": "https://youtu.be/UFU7usbJj3s",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/create-your-own-calculator4308/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Evaluate Reverse Polish Notation",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
        "youtubeUrl": "https://youtu.be/wKbDy5FWksE",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/evaluation-of-postfix-expression1735/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Basic Calculator",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/basic-calculator/",
        "youtubeUrl": "https://www.youtube.com/watch?v=UFU7usbJj3s",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/calculator/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 23,
    "pattern": "Stack Simulation",
    "topic": "Stack Simulation",
    "date": "Jul 23",
    "youtubeId": "lNJBYVQwE7Q",
    "problems": [
      {
        "name": "Remove All Adjacent Duplicates In String",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/",
        "youtubeUrl": "https://youtu.be/lNJBYVQwE7Q?si=cycOhFzVjx4v48dI",
        "gfgUrl": "https://www.geeksforgeeks.org/dsa/remove-all-adjacent-duplicates-in-string-ii/",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Remove K Digits",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/remove-k-digits/",
        "youtubeUrl": "https://youtu.be/u9Ih5uY-6U0?si=qBZ1HKJ63A5yBHIy",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/remove-k-digits/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Simplify Path",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/simplify-path/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Backspace String Compare",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/backspace-string-compare/",
        "youtubeUrl": "https://youtu.be/mRCQeS5wFfQ?si=ZPXG095PWtTf08sw",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/string-comparison5858/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 24,
    "pattern": "Parenthesis & Scoring",
    "topic": "Parenthesis & Stack Design",
    "date": "Jul 24",
    "youtubeId": "3VCxVEkraw8",
    "problems": [
      {
        "name": "Valid Parentheses",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/valid-parentheses/",
        "youtubeUrl": "https://youtu.be/3VCxVEkraw8?si=p-bvF1Rx6gdsHaSe",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/parenthesis-checker2744/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Score of Parentheses",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/score-of-parentheses/",
        "youtubeUrl": "https://youtu.be/6ELzHiH4kZ8?si=W-Bjvo4FpLvJYcb8",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/score-of-parentheses-string/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Minimum Add to Make Parentheses Valid",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/",
        "youtubeUrl": "https://youtu.be/OJnsjxISoP0?si=YWC2gEdH8LiLbmnr",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/min-add-to-make-parentheses-valid/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 25,
    "pattern": "Stack-Based Design",
    "topic": "Stack-Based Design",
    "date": "Jul 25",
    "youtubeId": "D9HDBEx_Bac",
    "problems": [
      {
        "name": "Min Stack",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/min-stack/",
        "youtubeUrl": "https://youtu.be/D9HDBEx_Bac?si=4d-suWPCG6phLsvU",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/get-minimum-element-from-stack/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Implement Queue using Stacks",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/implement-queue-using-stacks/",
        "youtubeUrl": "https://youtu.be/83r2JVsu5Ro?si=1Lz8Vw7H58Duim_n",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/queue-using-stack/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Maximum Frequency Stack",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-frequency-stack/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 26,
    "pattern": "Stack + Greedy",
    "topic": "Stack + Greedy & Recursive Stack",
    "date": "Jul 26",
    "youtubeId": "VNBVQ89mlTo",
    "problems": [
      {
        "name": "Remove Duplicate Letters",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/remove-duplicate-letters/",
        "youtubeUrl": "https://youtu.be/VNBVQ89mlTo?si=_m94Uvyq0XIHJ2Ra",
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "132 Pattern",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/132-pattern/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Reverse Stack using Recursion",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/reverse-a-stack-using-recursion/",
        "youtubeUrl": "https://youtu.be/PrvZ91XczPA?si=4p8IwVUzKUPV_jtX",
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/reverse-a-stack/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 27,
    "pattern": "Review",
    "topic": "REVISION: Stack",
    "date": "Jul 27",
    "youtubeId": "uLCmHMPQo2M",
    "problems": [
      {
        "name": "Re-solve Trapping Rain Water",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/trapping-rain-water/",
        "youtubeUrl": "https://www.youtube.com/watch?v=uLCmHMPQo2M&list=PLvNVexrplJJzvtkPJ6tTZGqbwd5NlJBF2&index=6",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/trapping-rain-water-1587115621/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Re-solve Largest Rectangle in Histogram",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/largest-rectangle-in-histogram/",
        "youtubeUrl": "https://youtu.be/OQJjh6AT00g",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-rectangular-area-in-a-histogram-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "1 new stack problem",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 28,
    "pattern": "Rest",
    "topic": "REST / Buffer Day",
    "date": "Jul 28",
    "youtubeId": "",
    "problems": [
      {
        "name": "Catch up on any pending problems",
        "difficulty": "Easy",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Review notes",
        "difficulty": "Easy",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 29,
    "pattern": "Linear Recursion",
    "topic": "Linear & Non-Linear Recursion",
    "date": "Jul 29",
    "youtubeId": "Z27GTaBEiMg",
    "problems": [
      {
        "name": "Fibonacci Number",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/fibonacci-number/",
        "youtubeUrl": "https://youtu.be/Z27GTaBEiMg?si=SMDB8BYTXkZk7G2p",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/print-first-n-fibonacci-numbers1002/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Pow(x, n)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/powx-n/",
        "youtubeUrl": "https://youtu.be/4XKU03AZt54?si=wMUCTlShlzgyz4ar",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/power-of-numbers-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Tower of Hanoi",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/c-program-for-tower-of-hanoi/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Generate Parentheses",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/generate-parentheses/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/generate-all-possible-parentheses/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 30,
    "pattern": "Divide & Conquer",
    "topic": "Divide & Conquer",
    "date": "Jul 30",
    "youtubeId": "",
    "problems": [
      {
        "name": "Sort an Array (Merge Sort)",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/sort-an-array/",
        "youtubeUrl": null,
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/merge-sort/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sort an Array (Quick Sort)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/sort-an-array/",
        "youtubeUrl": null,
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/quick-sort/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Count of Inversions",
        "difficulty": "Hard",
        "leetcodeUrl": "https://www.geeksforgeeks.org/counting-inversions/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/kth-largest-element5034/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 31,
    "pattern": "Unknown",
    "topic": "Recursion on LinkedList/",
    "date": "Jul 31",
    "youtubeId": "",
    "problems": [
      {
        "name": "Reverse Linked List (recursive)",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
        "youtubeUrl": null,
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Subsets",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/subsets/",
        "youtubeUrl": null,
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/power-set/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Subsets II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/subsets-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/subset-sum-ii/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Subsequence Sum",
        "difficulty": "Easy",
        "leetcodeUrl": "https://www.geeksforgeeks.org/sum-of-all-subsequences-of-an-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 32,
    "pattern": "Basic Operations",
    "topic": "Linked List: Basic Operations",
    "date": "Aug 1",
    "youtubeId": "ZSyUwlzmN-U",
    "problems": [
      {
        "name": "Middle of the Linked List",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/middle-of-the-linked-list/",
        "youtubeUrl": "https://www.youtube.com/watch?v=ZSyUwlzmN-U",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/finding-middle-element-in-a-linked-list/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Delete Node in a Linked List",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/delete-node-in-a-linked-list/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Remove Nth Node From End of List",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/nth-node-from-end-of-linked-list/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Design Linked List",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/design-linked-list/",
        "youtubeUrl": "https://www.youtube.com/watch?v=szJxAKv16es",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/introduction-to-linked-list/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 33,
    "pattern": "Fast and Slow Pointers",
    "topic": "Linked List: Fast & Slow Pointers",
    "date": "Aug 2",
    "youtubeId": "CVPhZHylPsg",
    "problems": [
      {
        "name": "Linked List Cycle",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle/",
        "youtubeUrl": "https://www.youtube.com/watch?v=CVPhZHylPsg",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Linked List Cycle II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/linked-list-cycle-ii/",
        "youtubeUrl": "https://www.youtube.com/watch?v=7Gp7DV5ufm4",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/remove-loop-in-linked-list/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Happy Number",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/happy-number/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Find the Duplicate Number",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-the-duplicate-number/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 34,
    "pattern": "Reversal Pattern",
    "topic": "Linked List: Reversal",
    "date": "Aug 3",
    "youtubeId": "aZ3L4M5SaXE",
    "problems": [
      {
        "name": "Reverse Linked List",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list/",
        "youtubeUrl": "https://www.youtube.com/watch?v=aZ3L4M5SaXE",
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Reverse Linked List II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-linked-list-ii/",
        "youtubeUrl": "https://www.youtube.com/watch?v=aZ3L4M5SaXE",
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/reverse-a-linked-list/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Reverse Nodes in k-Group",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        "youtubeUrl": "https://www.youtube.com/watch?v=vMKUlvivp0A",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/reverse-a-linked-list-in-groups-of-given-size/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Palindrome Linked List",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-linked-list/",
        "youtubeUrl": "https://www.youtube.com/watch?v=N6Gg4zUI73E",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/check-if-linked-list-is-pallindrome/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 35,
    "pattern": "Merge / Sort",
    "topic": "Linked List: Merge & Sort",
    "date": "Aug 4",
    "youtubeId": "WWOvCh31xBk",
    "problems": [
      {
        "name": "Merge Two Sorted Lists",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/merge-two-sorted-lists/",
        "youtubeUrl": "https://www.youtube.com/watch?v=WWOvCh31xBk",
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Merge K Sorted Lists",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sort List",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/sort-list/",
        "youtubeUrl": "https://www.youtube.com/watch?v=G1-oSUP2vcU",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/sort-a-linked-list/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Reorder List",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/reorder-list/",
        "youtubeUrl": "https://www.youtube.com/watch?v=drBFwqH4JrM",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/reorder-list/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 36,
    "pattern": "Unknown",
    "topic": "LinkedList with Stack/",
    "date": "Aug 5",
    "youtubeId": "",
    "problems": [
      {
        "name": "Next Greater Node In Linked List",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/next-greater-node-in-linked-list/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Copy List with Random Pointer",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/copy-list-with-random-pointer/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/clone-linked-list-next-random-pointer-o1-space/",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "LRU Cache",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/lru-cache/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/lru-cache/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 37,
    "pattern": "Basic DLL Operations",
    "topic": "Doubly Linked List",
    "date": "Aug 6",
    "youtubeId": "",
    "problems": [
      {
        "name": "Design Browser History",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/design-browser-history/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Flatten a Multilevel Doubly Linked List",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "LFU Cache",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/lfu-cache/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/lfu-cache-1665050355/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 38,
    "pattern": "Review",
    "topic": "REVISION: Recursion + Linked List",
    "date": "Aug 7",
    "youtubeId": "",
    "problems": [
      {
        "name": "Re-solve Reverse Nodes in k-Group",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-nodes-in-k-group/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/reverse-a-linked-list-in-groups-of-given-size/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Re-solve LRU Cache",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/lru-cache/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/lru-cache/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "1 new linked list problem",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 39,
    "pattern": "Frequency Map / Counting",
    "topic": "HashMap: Frequency Map",
    "date": "Aug 8",
    "youtubeId": "",
    "problems": [
      {
        "name": "Top K Frequent Elements",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/top-k-frequent-elements-in-array/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sort Characters By Frequency",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/sort-characters-by-frequency/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/sort-string-according-to-increasing-frequency/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Majority Element",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/majority-element/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/majority-element-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Find All Duplicates in an Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 40,
    "pattern": "Prefix-Sum with Map",
    "topic": "HashMap: Prefix Sum with Map",
    "date": "Aug 9",
    "youtubeId": "d2wUDNz_6iA",
    "problems": [
      {
        "name": "Subarray Sum Equals K",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/subarray-sum-equals-k/",
        "youtubeUrl": "https://www.youtube.com/watch?v=d2wUDNz_6iA&list=PLvNVexrplJJzc0FYDK1M7feNLJVSCV-cL&index=5",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/subarrays-with-sum-k/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Longest Subarray with Sum K",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/longest-sub-array-sum-k/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Contiguous Array (Equal 0s and 1s)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/contiguous-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 41,
    "pattern": "Sliding Window + HashMap",
    "topic": "HashMap: Sliding Window",
    "date": "Aug 10",
    "youtubeId": "92dMI4paQY4",
    "problems": [
      {
        "name": "Longest Substring Without Repeating Characters",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        "youtubeUrl": "https://youtu.be/92dMI4paQY4",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/longest-distinct-characters-in-string5848/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Minimum Window Substring",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-window-substring/",
        "youtubeUrl": "https://youtu.be/9w9xip122n8",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/smallest-window-in-a-string-containing-all-the-characters-of-another-string-1587115621/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Longest Substring with At Most K Distinct Characters",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/",
        "youtubeUrl": "https://youtu.be/Gsz_bGhI6v4",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/longest-k-unique-characters-substring0853/1",
        "done": false,
        "isMissingVideo": false
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 42,
    "pattern": "Rest",
    "topic": "REST / Buffer Day",
    "date": "Aug 11",
    "youtubeId": "",
    "problems": [
      {
        "name": "Revisit weakest area so far",
        "difficulty": "Easy",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Solve 2 problems from any topic",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 43,
    "pattern": "DFS Traversals",
    "topic": "Tree DFS: Basics",
    "date": "Aug 12",
    "youtubeId": "",
    "problems": [
      {
        "name": "Binary Tree Inorder Traversal",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-inorder-traversal/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/inorder-traversal/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Maximum Depth of Binary Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/height-of-binary-tree/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Diameter of Binary Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/diameter-of-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Path Sum",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/path-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/root-to-leaf-path-sum/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 44,
    "pattern": "DFS Traversals",
    "topic": "Tree DFS: Medium",
    "date": "Aug 13",
    "youtubeId": "",
    "problems": [
      {
        "name": "Path Sum II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/path-sum-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/root-to-leaf-path-sum/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sum Root to Leaf Numbers",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/sum-root-to-leaf-numbers/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-path-sum-from-any-node/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Count Good Nodes in Binary Tree",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/count-good-nodes-in-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 45,
    "pattern": "DFS Traversals",
    "topic": "Tree DFS: Subtree Problems",
    "date": "Aug 14",
    "youtubeId": "",
    "problems": [
      {
        "name": "Symmetric Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/symmetric-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Same Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/same-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/determine-if-two-trees-are-identical/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Subtree of Another Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/subtree-of-another-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Balanced Binary Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/balanced-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 46,
    "pattern": "BFS / Level-Order",
    "topic": "Tree BFS / Level-Order",
    "date": "Aug 15",
    "youtubeId": "",
    "problems": [
      {
        "name": "Binary Tree Level Order Traversal",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-level-order-traversal/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/level-order-traversal/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Binary Tree Zigzag Level Order Traversal",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/zigzag-tree-traversal/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Average of Levels in Binary Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/average-of-levels-in-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Binary Tree Right Side View",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-right-side-view/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/right-view-of-binary-tree/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 47,
    "pattern": "Lowest Common Ancestor",
    "topic": "Tree: LCA",
    "date": "Aug 16",
    "youtubeId": "",
    "problems": [
      {
        "name": "Lowest Common Ancestor of a Binary Tree",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-binary-tree/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "LCA of Deepest Leaves",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-deepest-leaves/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "All Nodes Distance K in Binary Tree",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 48,
    "pattern": "Serialization / Construction",
    "topic": "Tree: Serialization & Construction",
    "date": "Aug 17",
    "youtubeId": "",
    "problems": [
      {
        "name": "Serialize and Deserialize Binary Tree",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Construct Binary Tree from Preorder and Inorder Traversal",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/inorder-traversal/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Flatten Binary Tree to Linked List",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/flatten-binary-tree-to-linked-list/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/flatten-binary-tree-to-linked-list/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 49,
    "pattern": "BST Operations",
    "topic": "BST Operations",
    "date": "Aug 18",
    "youtubeId": "",
    "problems": [
      {
        "name": "Search in a Binary Search Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/search-in-a-binary-search-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/search-a-node-in-bst/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Insert into a Binary Search Tree",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/insert-into-a-binary-search-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/insert-a-node-in-a-bst/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Delete Node in a BST",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/delete-node-in-a-bst/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/delete-a-node-from-bst/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Validate Binary Search Tree",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/validate-binary-search-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/check-for-bst/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 50,
    "pattern": "LCA & Range Queries",
    "topic": "BST: LCA & Range Queries",
    "date": "Aug 19",
    "youtubeId": "",
    "problems": [
      {
        "name": "Lowest Common Ancestor of a BST",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/lowest-common-ancestor-in-a-bst/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Kth Smallest Element in a BST",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/kth-smallest-element-in-a-bst/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/find-k-th-smallest-element-in-bst-order-statistics-in-bst/",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Range Sum of BST",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/range-sum-of-bst/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Convert BST to Greater Tree",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/convert-bst-to-greater-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 51,
    "pattern": "Review",
    "topic": "REVISION: Trees",
    "date": "Aug 20",
    "youtubeId": "",
    "problems": [
      {
        "name": "Re-solve Binary Tree Max Path Sum",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-path-sum-from-any-node/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Re-solve Serialize & Deserialize",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/serialize-and-deserialize-a-binary-tree/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "1 new tree problem",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 52,
    "pattern": "BFS (Unweighted Path)",
    "topic": "Graph BFS: Basics",
    "date": "Aug 21",
    "youtubeId": "",
    "problems": [
      {
        "name": "Number of Islands",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-islands/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/find-the-number-of-islands/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Rotting Oranges",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/rotting-oranges/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/rotten-oranges2536/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "01 Matrix",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/01-matrix/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/distance-of-nearest-cell-having-1-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Flood Fill",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/flood-fill/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/flood-fill-algorithm1856/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 53,
    "pattern": "BFS (Unweighted Path)",
    "topic": "Graph BFS: Multi-source",
    "date": "Aug 22",
    "youtubeId": "",
    "problems": [
      {
        "name": "Walls and Gates",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/walls-and-gates/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/reducing-walls4443/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Pacific Atlantic Water Flow",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/pacific-atlantic-water-flow/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 54,
    "pattern": "DFS (Connectivity)",
    "topic": "Graph DFS: Connected Components",
    "date": "Aug 23",
    "youtubeId": "",
    "problems": [
      {
        "name": "Number of Connected Components in an Undirected Graph",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Clone Graph",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/clone-graph/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/clone-graph/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Course Schedule",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/course-schedule-i/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Course Schedule II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/course-schedule/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 55,
    "pattern": "DFS (Connectivity)",
    "topic": "Graph DFS: Cycle & Coloring",
    "date": "Aug 24",
    "youtubeId": "",
    "problems": [
      {
        "name": "Is Graph Bipartite?",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/is-graph-bipartite/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/bipartite-graph/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Detect Cycle in Directed Graph",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/detect-cycle-in-a-graph/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Find Eventual Safe States",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-eventual-safe-states/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/eventual-safe-states/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 56,
    "pattern": "Topological Sort",
    "topic": "Graph: Topological Sort",
    "date": "Aug 25",
    "youtubeId": "",
    "problems": [
      {
        "name": "Course Schedule (Kahn's BFS)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/course-schedule/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/course-schedule-i/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Alien Dictionary",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/alien-dictionary/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sequence Reconstruction",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/sequence-reconstruction/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Largest Color Value in a Directed Graph",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/largest-color-value-in-a-directed-graph/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 57,
    "pattern": "Rest",
    "topic": "REST / Buffer Day",
    "date": "Aug 26",
    "youtubeId": "",
    "problems": [
      {
        "name": "Graph revision — 3 problems",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Read about Union-Find theory",
        "difficulty": "Easy",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 58,
    "pattern": "MST / Union-Find",
    "topic": "MST & Union-Find",
    "date": "Aug 27",
    "youtubeId": "",
    "problems": [
      {
        "name": "Number of Provinces",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-provinces/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Redundant Connection",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/redundant-connection/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/disjoint-set-union-find/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Min Cost to Connect All Points (Kruskal's)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Min Cost to Connect All Points (Prim's)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-to-connect-all-points/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 59,
    "pattern": "MST / Union-Find",
    "topic": "Union-Find Advanced",
    "date": "Aug 28",
    "youtubeId": "",
    "problems": [
      {
        "name": "Accounts Merge",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/accounts-merge/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/account-merge/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Making A Large Island",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/making-a-large-island/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Swim in Rising Water",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/swim-in-rising-water/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 60,
    "pattern": "Dijkstra (Weighted)",
    "topic": "Dijkstra: Shortest Path",
    "date": "Aug 29",
    "youtubeId": "",
    "problems": [
      {
        "name": "Network Delay Time",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/network-delay-time/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/network-delay-time/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Path with Minimum Effort",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/path-with-minimum-effort/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/path-with-minimum-effort/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Cheapest Flights Within K Stops",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/cheapest-flights-within-k-stops/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Path with Maximum Probability",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/path-with-maximum-probability/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 61,
    "pattern": "Bellman-Ford",
    "topic": "Dijkstra Advanced + Bellman-Ford",
    "date": "Aug 30",
    "youtubeId": "",
    "problems": [
      {
        "name": "Cheapest Flights Within K Stops (Bellman-Ford)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/cheapest-flights-within-k-stops/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Network Delay Time (Bellman-Ford)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/network-delay-time/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/network-delay-time/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Find Negative Weight Cycle",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/detect-negative-cycle-graph-bellman-ford/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 62,
    "pattern": "Floyd-Warshall",
    "topic": "Floyd-Warshall",
    "date": "Aug 31",
    "youtubeId": "",
    "problems": [
      {
        "name": "Find the City With the Smallest Number of Neighbors",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Floyd-Warshall (All Pairs Shortest Path)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/floyd-warshall-algorithm-dp-16/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/implementing-floyd-warshall2042/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Number of Restricted Paths",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-restricted-paths-from-first-to-last-node/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 63,
    "pattern": "Review",
    "topic": "REVISION: Graphs",
    "date": "Sep 1",
    "youtubeId": "",
    "problems": [
      {
        "name": "Re-solve Alien Dictionary",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/alien-dictionary/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/alien-dictionary/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Re-solve Cheapest Flights K Stops",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/cheapest-flights-within-k-stops/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/cheapest-flights-within-k-stops/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "1 new graph problem",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 64,
    "pattern": "Top-K Elements",
    "topic": "Heap: Top-K Elements",
    "date": "Sep 2",
    "youtubeId": "",
    "problems": [
      {
        "name": "Kth Largest Element in an Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/kth-largest-element5034/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Top K Frequent Elements",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/top-k-frequent-elements/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/top-k-frequent-elements-in-array/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "K Closest Points to Origin",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/k-closest-points-to-origin/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Find K Pairs with Smallest Sums",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/find-k-pairs-with-smallest-sums/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/find-k-smallest-sum-pairs/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 65,
    "pattern": "Merge K Sorted",
    "topic": "Heap: Merge K Sorted + Sliding",
    "date": "Sep 3",
    "youtubeId": "e8iJPXS64MY",
    "problems": [
      {
        "name": "Merge K Sorted Lists",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/merge-k-sorted-lists/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/merge-k-sorted-linked-lists/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sliding Window Maximum",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/sliding-window-maximum/",
        "youtubeUrl": "https://www.youtube.com/watch?v=e8iJPXS64MY&list=PLvNVexrplJJyQTJ7a6sx3MzZjq1cR2geB&index=9",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-of-all-subarrays-of-size-k3101/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Find Median from Data Stream",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/find-median-in-a-stream-1587115620/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 66,
    "pattern": "Huffman pattern",
    "topic": "Heap: Huffman + Design",
    "date": "Sep 4",
    "youtubeId": "",
    "problems": [
      {
        "name": "Task Scheduler",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/task-scheduler/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/task-scheduler/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Reorganize String",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/reorganize-string/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/rearrange-characters4649/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Minimum Cost to Connect Sticks",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-cost-to-connect-sticks/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Huffman Encoding",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 67,
    "pattern": "Choice-Based Backtracking",
    "topic": "Backtracking: Choice-Based",
    "date": "Sep 5",
    "youtubeId": "",
    "problems": [
      {
        "name": "Permutations",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/permutations/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/permutations-of-a-given-string2041/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Permutations II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/permutations-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/all-unique-permutations-of-an-array/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Combinations",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/combinations/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/possible-words-from-phone-digits-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Combination Sum",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/combination-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/combination-sum-1587115620/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 68,
    "pattern": "Unknown",
    "topic": "Constraint-Based",
    "date": "Sep 6",
    "youtubeId": "",
    "problems": [
      {
        "name": "Subsets",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/subsets/",
        "youtubeUrl": null,
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/power-set/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Subsets II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/subsets-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/subset-sum-ii/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Letter Combinations of a Phone Number",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/letter-combinations-of-a-phone-number/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/possible-words-from-phone-digits-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Palindrome Partitioning",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/palindromic-patitioning4845/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 69,
    "pattern": "Grid / Path Backtracking",
    "topic": "Backtracking: Grid & Sequence",
    "date": "Sep 7",
    "youtubeId": "",
    "problems": [
      {
        "name": "Word Search",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/word-search/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/word-search-ii/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "N-Queens",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/n-queens/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/n-queen-problem0315/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sudoku Solver",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/sudoku-solver/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/solve-the-sudoku-1587115621/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Rat in a Maze",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/rat-in-a-maze-backtracking-2/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/rat-in-a-maze-problem/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 70,
    "pattern": "Rest",
    "topic": "REST / Buffer Day",
    "date": "Sep 8",
    "youtubeId": "",
    "problems": [
      {
        "name": "Backtracking problems revision",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Solve 1 hard backtracking problem",
        "difficulty": "Hard",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 71,
    "pattern": "Intervals & Reach",
    "topic": "Greedy: Intervals",
    "date": "Sep 9",
    "youtubeId": "",
    "problems": [
      {
        "name": "Meeting Rooms",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/attend-all-meetings-ii/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Meeting Rooms II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/meeting-rooms-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/attend-all-meetings-ii/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Non-overlapping Intervals",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/non-overlapping-intervals/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/non-overlapping-intervals/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Merge Intervals",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/merge-intervals/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/overlapping-intervals--170633/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 72,
    "pattern": "Intervals & Reach",
    "topic": "Greedy: Jump & Reach",
    "date": "Sep 10",
    "youtubeId": "",
    "problems": [
      {
        "name": "Jump Game",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/jump-game/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/jump-game/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Jump Game II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/jump-game-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/minimum-number-of-jumps-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Gas Station",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/gas-station/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Minimum Number of Arrows to Burst Balloons",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/hit-most-balloons--170637/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 73,
    "pattern": "Sorting / Local Choice",
    "topic": "Greedy: Sorting & Local Choice",
    "date": "Sep 11",
    "youtubeId": "",
    "problems": [
      {
        "name": "Assign Cookies",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/assign-cookies/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Lemonade Change",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/lemonade-change/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Candy",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/candy/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/candy/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Queue Reconstruction by Height",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/queue-reconstruction-by-height/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 74,
    "pattern": "Sorting / Local Choice",
    "topic": "Greedy Advanced",
    "date": "Sep 12",
    "youtubeId": "",
    "problems": [
      {
        "name": "Task Scheduler",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/task-scheduler/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/task-scheduler/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Minimum Number of Platforms",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/minimum-number-platforms-required-railwaybus-station/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Largest Number",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/largest-number/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/largest-number-formed-from-an-array1117/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "IPO",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/ipo/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 75,
    "pattern": "Review",
    "topic": "REVISION: Heap + Greedy",
    "date": "Sep 13",
    "youtubeId": "",
    "problems": [
      {
        "name": "Re-solve Find Median from Data Stream",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/find-median-from-data-stream/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/find-median-in-a-stream-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Re-solve Candy",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/candy/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/candy/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "1 new greedy problem",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 76,
    "pattern": "1D / Linear DP",
    "topic": "DP: 1D Linear",
    "date": "Sep 14",
    "youtubeId": "Z27GTaBEiMg",
    "problems": [
      {
        "name": "Climbing Stairs",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/climbing-stairs/",
        "youtubeUrl": "https://youtu.be/Z27GTaBEiMg?si=SMDB8BYTXkZk7G2p",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/count-ways-to-reach-the-nth-stair-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "House Robber",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/stickler-theif-1587115621/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Min Cost Climbing Stairs",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/min-cost-climbing-stairs/",
        "youtubeUrl": "https://youtu.be/Z27GTaBEiMg?si=SMDB8BYTXkZk7G2p",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/count-ways-to-reach-the-nth-stair-1587115620/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Decode Ways",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/decode-ways/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/total-decoding-messages1235/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 77,
    "pattern": "2D / Grid DP",
    "topic": "DP: 2D Grid",
    "date": "Sep 15",
    "youtubeId": "NA4E0QQdTOk",
    "problems": [
      {
        "name": "Unique Paths",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/unique-paths/",
        "youtubeUrl": "https://youtu.be/NA4E0QQdTOk?si=tzUU5ismfzX4CCxn",
        "gfgUrl": "https://www.geeksforgeeks.org/problems/unique-paths-in-a-grid--170647/1",
        "done": false,
        "isMissingVideo": false
      },
      {
        "name": "Minimum Path Sum",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-path-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/minimum-cost-path3833/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Maximal Square",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximal-square/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Dungeon Game",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/dungeon-game/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/minimum-points-to-reach-destination0540/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 78,
    "pattern": "2D / Grid DP",
    "topic": "DP: 2D Grid Part 2",
    "date": "Sep 16",
    "youtubeId": "",
    "problems": [
      {
        "name": "Triangle",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/triangle/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Cherry Pickup",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/cherry-pickup/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/chocolates-pickup/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Out of Boundary Paths",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/out-of-boundary-paths/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 79,
    "pattern": "DP on Strings",
    "topic": "DP on Strings: LCS Family",
    "date": "Sep 17",
    "youtubeId": "",
    "problems": [
      {
        "name": "Longest Common Subsequence",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-common-subsequence/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/longest-common-subsequence-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Longest Common Substring",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/longest-common-substring-dp-29/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Shortest Common Supersequence",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/shortest-common-supersequence/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/shortest-common-supersequence0322/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Edit Distance",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/edit-distance/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/edit-distance3702/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 80,
    "pattern": "DP on Strings",
    "topic": "DP on Strings: Palindrome",
    "date": "Sep 18",
    "youtubeId": "",
    "problems": [
      {
        "name": "Longest Palindromic Subsequence",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/longest-palindromic-subsequence/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/longest-palindromic-subsequence-1612327878/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Minimum Insertions to Make a String Palindrome",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Palindrome Partitioning II",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/palindrome-partitioning-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/palindromic-patitioning4845/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 81,
    "pattern": "Rest",
    "topic": "REST / Buffer Day",
    "date": "Sep 19",
    "youtubeId": "",
    "problems": [
      {
        "name": "Re-solve Edit Distance",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/edit-distance/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/edit-distance3702/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "2 pending DP problems",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 82,
    "pattern": "DP on Intervals",
    "topic": "DP on Intervals",
    "date": "Sep 20",
    "youtubeId": "",
    "problems": [
      {
        "name": "Burst Balloons",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/burst-balloons/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/burst-balloons/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Strange Printer",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/strange-printer/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Minimum Score Triangulation of Polygon",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-score-triangulation-of-polygon/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Matrix Chain Multiplication",
        "difficulty": "Hard",
        "leetcodeUrl": "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/matrix-chain-multiplication0303/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 83,
    "pattern": "DP on Trees / DAGs",
    "topic": "DP on Trees",
    "date": "Sep 21",
    "youtubeId": "",
    "problems": [
      {
        "name": "House Robber III",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/house-robber-iii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-sum-of-non-adjacent-nodes/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Diameter of Binary Tree",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/diameter-of-binary-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/diameter-of-binary-tree/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Binary Tree Maximum Path Sum",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/binary-tree-maximum-path-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/maximum-path-sum-from-any-node/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Sum of Distances in Tree",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/sum-of-distances-in-tree/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 84,
    "pattern": "Knapsack / Subset Sum",
    "topic": "Knapsack: 0/1 & Unbounded",
    "date": "Sep 22",
    "youtubeId": "",
    "problems": [
      {
        "name": "0/1 Knapsack",
        "difficulty": "Medium",
        "leetcodeUrl": "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Partition Equal Subset Sum",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/partition-equal-subset-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/subset-sum-problem2014/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Coin Change",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/number-of-coins1824/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Perfect Squares",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/perfect-squares/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 85,
    "pattern": "Knapsack / Subset Sum",
    "topic": "Knapsack: Bounded & Variations",
    "date": "Sep 23",
    "youtubeId": "",
    "problems": [
      {
        "name": "Coin Change II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/coin-change-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/coin-change2448/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Target Sum",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/target-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/perfect-sum-problem5633/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Last Stone Weight II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/last-stone-weight-ii/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Number of Dice Rolls With Target Sum",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-dice-rolls-with-target-sum/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/target-sum-1626326450/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 86,
    "pattern": "DP on Stocks",
    "topic": "DP on Stocks",
    "date": "Sep 24",
    "youtubeId": "",
    "problems": [
      {
        "name": "Best Time to Buy and Sell Stock",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/buy-maximum-stocks-if-i-stocks-can-be-bought-on-i-th-day/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Best Time to Buy and Sell Stock II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Best Time to Buy and Sell Stock with Cooldown",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Best Time to Buy and Sell Stock with Transaction Fee",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 87,
    "pattern": "DP on Stocks",
    "topic": "DP Stocks Hard + Trie Intro",
    "date": "Sep 25",
    "youtubeId": "",
    "problems": [
      {
        "name": "Best Time to Buy and Sell Stock III",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Best Time to Buy and Sell Stock IV",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Implement Trie (Prefix Tree)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/implement-trie-prefix-tree/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/trie-insert-and-search0651/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 88,
    "pattern": "Basic Trie Operations",
    "topic": "Trie: Word Operations",
    "date": "Sep 26",
    "youtubeId": "",
    "problems": [
      {
        "name": "Search Suggestions System",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/search-suggestions-system/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/phone-directory4628/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Replace Words",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/replace-words/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/replace-a-word5553/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Design Add and Search Words Data Structure",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/design-add-and-search-words-data-structure--154618/1",
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 89,
    "pattern": "Word Break / Segmentation",
    "topic": "Trie: Word Break + Bitwise",
    "date": "Sep 27",
    "youtubeId": "",
    "problems": [
      {
        "name": "Word Break",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/word-break/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/word-break1352/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Word Break II",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/word-break-ii/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/word-break1352/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Maximum XOR of Two Numbers in an Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 90,
    "pattern": "Basic Bit Operations",
    "topic": "Bit Manipulation",
    "date": "Sep 28",
    "youtubeId": "",
    "problems": [
      {
        "name": "Single Number",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/single-number/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/element-appearing-once2552/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Single Number II",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/single-number-ii/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Number of 1 Bits",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/number-of-1-bits/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/count-total-set-bits-1587115620/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Missing Number",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/missing-number/",
        "youtubeUrl": null,
        "gfgUrl": "https://www.geeksforgeeks.org/problems/missing-number-in-array1416/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Reverse Bits",
        "difficulty": "Easy",
        "leetcodeUrl": "https://leetcode.com/problems/reverse-bits/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 91,
    "pattern": "Subsets / Bitmask",
    "topic": "Bitmask + Advanced XOR",
    "date": "Sep 29",
    "youtubeId": "",
    "problems": [
      {
        "name": "Subsets (bitmask approach)",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/subsets/",
        "youtubeUrl": null,
        "gfgUrl": "https://practice.geeksforgeeks.org/problems/power-set/1",
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Maximum XOR of Two Numbers in an Array",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Count Triplets That Can Form Two Arrays of Equal XOR",
        "difficulty": "Medium",
        "leetcodeUrl": "https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Minimum XOR Sum of Two Arrays",
        "difficulty": "Hard",
        "leetcodeUrl": "https://leetcode.com/problems/minimum-xor-sum-of-two-arrays/",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  },
  {
    "id": 92,
    "pattern": "Review",
    "topic": "FINAL REVISION + Mock",
    "date": "Sep 30",
    "youtubeId": "",
    "problems": [
      {
        "name": "Solve 5 random problems from any topic",
        "difficulty": "Medium",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Time yourself — 30 min per problem",
        "difficulty": "Hard",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      },
      {
        "name": "Review all patterns one last time",
        "difficulty": "Easy",
        "leetcodeUrl": "",
        "youtubeUrl": null,
        "gfgUrl": null,
        "done": false,
        "isMissingVideo": true
      }
    ],
    "done": false,
    "notes": ""
  }
];
